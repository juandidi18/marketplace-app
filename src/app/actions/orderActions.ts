'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createOrder(orderData: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: any[];
  total: number;
  userId?: string;
}) {
  try {
    // 1. Transaction to ensure atomicity
    const result = await db.$transaction(async (tx) => {
      // 2. Check stock for all items
      for (const item of orderData.items) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
          select: { stock: true, name: true }
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para: ${product?.name || 'Producto desconocido'}`);
        }
      }

      // 3. Create the order
      const order = await tx.order.create({
        data: {
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone,
          shippingAddress: orderData.shippingAddress,
          total: orderData.total,
          userId: orderData.userId || null,
          items: {
            create: orderData.items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      // 4. Update stock for each product
      for (const item of orderData.items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return order;
    });

    revalidatePath('/admin/products');
    revalidatePath('/admin/orders');
    return { success: true, orderId: result.id };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message || 'Error al procesar el pedido' };
  }
}

export async function getOrders() {
  try {
    const orders = await db.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Get order details and current status
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      });

      if (!order) throw new Error('Pedido no encontrado');

      // 2. Logic to restore stock if cancelled
      if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          });
        }
      } 
      // 3. Logic to re-deduct stock if un-cancelled (e.g. from CANCELLED to PENDING)
      else if (status !== 'CANCELLED' && order.status === 'CANCELLED') {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }

      // 4. Update status
      return await tx.order.update({
        where: { id: orderId },
        data: { status }
      });
    });

    revalidatePath('/admin/orders');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message || 'No se pudo actualizar el estado' };
  }
}

