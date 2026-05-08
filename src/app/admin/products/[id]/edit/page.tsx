'use client';

import { useEffect, useState, use } from 'react';
import ProductForm from '@/components/ProductForm';
import { getProductById, updateProduct } from '@/app/actions/productActions';
import { getCategories } from '@/app/actions/categoryActions';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const prod = await getProductById(id);
      const cats = await getCategories();
      setProduct(prod);
      setCategories(cats);
      setIsLoading(false);
    }
    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Producto no encontrado</h2>
      </div>
    );
  }

  const initialData = {
    ...product,
    category: product.categoryId || '',
  };

  const handleUpdate = async (data: any) => {
    return await updateProduct(id, data);
  };

  return (
    <div className="pt-10">
      <ProductForm 
        title="Editar Producto" 
        buttonText="Actualizar Cambios" 
        initialData={initialData as any}
        categories={categories}
        onSubmit={handleUpdate}
        onSuccess={() => router.push('/admin/products')}
      />
    </div>
  );
}
