import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Migrando categorías...');
  
  // 1. Obtener todos los strings de categorías únicos
  const products = await prisma.product.findMany();
  const uniqueCategoryNames = Array.from(new Set(products.map(p => (p as any).categoryStr)));
  
  console.log('Categorías encontradas:', uniqueCategoryNames);

  // 2. Crear las categorías en la DB si no existen
  const categoriesMap: Record<string, string> = {};
  for (let i = 0; i < uniqueCategoryNames.length; i++) {
    const name = uniqueCategoryNames[i];
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, order: i }
    });
    categoriesMap[name] = cat.id;
  }

  // 3. Vincular productos a sus nuevas categorías
  for (const product of products) {
    const categoryName = (product as any).categoryStr;
    const categoryId = categoriesMap[categoryName];
    
    if (categoryId) {
      await prisma.product.update({
        where: { id: product.id },
        data: { categoryId }
      });
      console.log(`Producto "${product.name}" vinculado a "${categoryName}"`);
    }
  }

  console.log('Migración completada con éxito.');
}

main().finally(() => prisma.$disconnect());
