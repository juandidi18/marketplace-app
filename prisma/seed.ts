import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialCategories = [
  'Electrónica',
  'Periféricos',
  'Wearables',
  'Hogar',
  'Accesorios',
  'Fotografía'
];

const initialProducts = [
  { name: 'Auriculares Premium Noise-Cancelling', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop', category: 'Electrónica', description: 'Sonido de alta fidelidad con cancelación de ruido activa.' },
  { name: 'Teclado Mecánico Custom 75%', price: 159.50, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop', category: 'Periféricos', description: 'Interruptores premium y diseño ergonómico.' },
  { name: 'Smartwatch Minimalista Series X', price: 199.00, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop', category: 'Wearables', description: 'Tu compañero ideal para la salud y el deporte.' },
  { name: 'Lámpara de Escritorio Inteligente', price: 89.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop', category: 'Hogar', description: 'Iluminación regulable desde tu smartphone.' },
  { name: 'Mochila de Cuero Elegante', price: 120.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop', category: 'Accesorios', description: 'Estilo y durabilidad para tu día a día.' },
  { name: 'Cámara Mirrorless 4K', price: 899.99, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop', category: 'Fotografía', description: 'Captura momentos inolvidables con calidad profesional.' },
];

async function main() {
  console.log('Seeding categories...');
  const categoryMap: Record<string, string> = {};
  
  for (const catName of initialCategories) {
    const category = await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: { name: catName }
    });
    categoryMap[catName] = category.id;
  }

  console.log('Seeding products...');
  for (const product of initialProducts) {
    const { category, ...productData } = product;
    await prisma.product.create({
      data: {
        ...productData,
        categoryId: categoryMap[category],
        stock: 10,
        rating: 4.5,
        reviewCount: 12
      },
    });
  }
  console.log('Seed finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
