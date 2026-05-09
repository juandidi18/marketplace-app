'use client';

import { useState, useEffect } from 'react';
import { getProducts, deleteProduct, updateProduct } from '@/app/actions/productActions';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit2, 
  Trash2, 
  Plus, 
  MoreHorizontal, 
  Package, 
  AlertCircle,
  Eye,
  CheckCircle2,
  Clock,
  Archive
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const data = await getProducts();
    setProducts(data);
    setIsLoading(false);
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    const result = await deleteProduct(productToDelete);
    if (result.success) {
      toast.success('Producto eliminado');
      setProducts(products.filter(p => p.id !== productToDelete));
    } else {
      toast.error(result.error);
    }
    setProductToDelete(null);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
    const result = await updateProduct(id, { status: newStatus });
    if (result.success) {
      toast.success(`Producto marcado como ${newStatus === 'ACTIVE' ? 'Activo' : 'Borrador'}`);
      setProducts(products.map(p => p.id === id ? { ...p, status: newStatus } : p));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Panel de Inventario</h1>
          <p className="text-muted-foreground">Gestiona tus productos, stock y visibilidad de la tienda.</p>
        </div>
        <Link 
          href="/upload"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </Link>
      </div>

      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-xl shadow-primary/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-5 font-semibold text-sm">Producto</th>
                <th className="px-6 py-5 font-semibold text-sm">Categoría</th>
                <th className="px-6 py-5 font-semibold text-sm">Precio</th>
                <th className="px-6 py-5 font-semibold text-sm">Stock</th>
                <th className="px-6 py-5 font-semibold text-sm">Estado</th>
                <th className="px-6 py-5 font-semibold text-sm text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-12 w-12 bg-muted rounded-lg" /></td>
                    <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-muted rounded w-full" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay productos en el inventario.</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border shadow-sm">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <span className="font-semibold text-sm line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-muted px-2.5 py-1 rounded-full font-medium">
                        {product.category?.name || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm">
                      S/. {product.price.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${
                          product.stock <= 5 ? 'text-red-500' : 'text-foreground'
                        }`}>
                          {product.stock}
                        </span>
                        {product.stock <= 5 && <AlertCircle className="w-4 h-4 text-red-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(product.id, product.status)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                          product.status === 'ACTIVE' 
                            ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                            : product.status === 'DRAFT'
                            ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {product.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {product.status === 'ACTIVE' ? 'Activo' : 'Borrador'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/store/${product.id}?from=admin`}
                          className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                          title="Ver en tienda"
                        >

                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        title="¿Eliminar producto?"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
