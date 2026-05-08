import { getProducts } from '@/app/actions/productActions';
import { getCategories } from '@/app/actions/categoryActions';
import CatalogClient from './CatalogClient';

export default async function StorePage() {
  const products = await getProducts('ACTIVE');

  const categories = await getCategories();

  return <CatalogClient initialProducts={products as any} categories={categories} />;
}
