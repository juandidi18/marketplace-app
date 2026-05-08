import { getProductById, updateProduct } from '@/app/actions/productActions';
import { getCategories } from '@/app/actions/categoryActions';
import ProductForm from '@/components/ProductForm';
import { notFound } from 'next/navigation';

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  const categories = await getCategories();

  if (!product) {
    notFound();
  }

  // Define a bound version of the server action to pass to the client component
  const updateProductWithId = updateProduct.bind(null, id);

  // Transform product to match ProductData interface
  const formattedProduct = {
    ...product,
    price: product.price.toString(),
    stock: product.stock.toString(),
    category: product.categoryId || '',
    image: product.image || '',
    // images: product.images?.map((img: any) => img.url) || [] // ProductForm expects image (string), not images (array) in initialData based on the interface
  };

  return (
    <ProductForm 
      title="Editar Producto" 
      buttonText="Guardar Cambios" 
      initialData={formattedProduct as any}
      onSubmit={updateProductWithId}
      categories={categories}
    />
  );

}
