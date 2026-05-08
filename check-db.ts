import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.product.count();
  console.log('Product count:', count);
  const products = await prisma.product.findMany();
  console.log('Products:', JSON.stringify(products, null, 2));
}
main().finally(() => prisma.$disconnect());
