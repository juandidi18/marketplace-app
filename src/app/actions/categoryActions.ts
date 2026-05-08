'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
  try {
    return await db.category.findMany({
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(name: string) {
  try {
    const lastCat = await db.category.findFirst({
      orderBy: { order: 'desc' },
    });
    const order = lastCat ? lastCat.order + 1 : 0;
    
    const category = await db.category.create({
      data: { name, order },
    });
    revalidatePath('/store');
    return { success: true, category };
  } catch (error) {
    return { success: false, error: 'No se pudo crear la categoría' };
  }
}

export async function updateCategory(id: string, name: string) {
  try {
    await db.category.update({
      where: { id },
      data: { name },
    });
    revalidatePath('/store');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'No se pudo actualizar' };
  }
}

export async function deleteCategory(id: string) {
  try {
    // Verificar si tiene productos vinculados
    const count = await db.product.count({ where: { categoryId: id } });
    if (count > 0) {
      return { success: false, error: 'No se puede eliminar una categoría con productos' };
    }
    
    await db.category.delete({ where: { id } });
    revalidatePath('/store');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al eliminar' };
  }
}

export async function reorderCategories(ids: string[]) {
  try {
    const transactions = ids.map((id, index) => 
      db.category.update({
        where: { id },
        data: { order: index }
      })
    );
    await db.$transaction(transactions);
    revalidatePath('/store');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al reordenar' };
  }
}
