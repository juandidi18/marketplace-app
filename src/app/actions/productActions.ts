'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getProducts(options?: string | { status?: string, take?: number }) {
  const status = typeof options === 'string' ? options : options?.status;
  const take = typeof options === 'object' ? options?.take : undefined;

  try {
    const products = await db.product.findMany({
      where: status ? { status } : {},
      take,
      include: {
        category: true,
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return products;

  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}


export async function createProduct(formData: any) {
  try {
    const { category, images, ...cleanData } = formData;
    
    const product = await db.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          ...cleanData,
          price: parseFloat(formData.price),
          discount: parseInt(formData.discount || '0'),
          stock: parseInt(formData.stock),
          rating: parseFloat(formData.rating || '5.0'),
          reviewCount: parseInt(formData.reviewCount || '0'),
          hasFreeShipping: formData.hasFreeShipping === true || formData.hasFreeShipping === 'true',
          hasWarranty: formData.hasWarranty === true || formData.hasWarranty === 'true',
          image: images?.[0] || null,
        },
      });

      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((url: string) => ({
            url,
            productId: newProduct.id,
          })),
        });
      }

      return newProduct;
    });
    
    revalidatePath('/store');
    revalidatePath('/admin/products');
    return { success: true, product };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Hubo un error al guardar el producto' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({
      where: { id },
    });
    revalidatePath('/store');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'No se pudo eliminar el producto' };
  }
}

export async function updateProduct(id: string, formData: any) {
  try {
    const { category, images, ...cleanData } = formData;
    
    const product = await db.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          ...cleanData,
          price: formData.price !== undefined ? parseFloat(formData.price) : undefined,
          discount: formData.discount !== undefined ? parseInt(formData.discount) : undefined,
          stock: formData.stock !== undefined ? parseInt(formData.stock) : undefined,
          rating: formData.rating !== undefined ? parseFloat(formData.rating) : undefined,
          reviewCount: formData.reviewCount !== undefined ? parseInt(formData.reviewCount) : undefined,
          hasFreeShipping: formData.hasFreeShipping !== undefined ? (formData.hasFreeShipping === true || formData.hasFreeShipping === 'true') : undefined,
          hasWarranty: formData.hasWarranty !== undefined ? (formData.hasWarranty === true || formData.hasWarranty === 'true') : undefined,
          image: images?.[0] || undefined,
        },
      });

      if (images) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((url: string) => ({
              url,
              productId: id,
            })),
          });
        }
      }

      return updatedProduct;
    });

    revalidatePath('/store');
    revalidatePath(`/store/${id}`);
    revalidatePath('/admin/products');
    return { success: true, product };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'No se pudo actualizar el producto' };
  }
}


export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    });
    return product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

