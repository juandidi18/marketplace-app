import { getProductById } from '@/app/actions/productActions';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const isDraft = product.status !== 'ACTIVE';
  
  // Optional: In a real app, you would check the user's session here
  // to allow admins to see drafts even without the query param.
  // For now, we rely on the '?from=admin' logic for the preview UI.


  // Convert Date to string for client component serialization
  const serializedProduct = {
    ...product,
    createdAt: product.createdAt.toISOString(),
  };

  return <ProductDetailClient product={serializedProduct} />;
}
