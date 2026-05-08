import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const p = await prisma.product.findFirst();
  if (!p) {
    console.log('No hay productos para borrar.');
    return;
  }
  console.log('Borrando:', p.name);
  await prisma.product.delete({ where: { id: p.id } });
  const count = await prisma.product.count();
  console.log('Productos restantes:', count);
}
main().finally(() => prisma.$disconnect());
