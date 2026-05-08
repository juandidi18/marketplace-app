import ProductForm from '@/components/ProductForm';
import { createProduct } from '@/app/actions/productActions';
import { getCategories } from '@/app/actions/categoryActions';

export default async function UploadPage() {
  const categories = await getCategories();

  return (
    <ProductForm 
      title="Sube tu Producto" 
      buttonText="Publicar Producto" 
      onSubmit={createProduct} 
      categories={categories}
    />
  );
}
