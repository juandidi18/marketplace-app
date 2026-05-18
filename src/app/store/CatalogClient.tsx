'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Ghost } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/store/useCart';
import Link from 'next/link';
import CategoryManager from '@/components/CategoryManager';

interface Category {
  id: string;
  name: string;
  order: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: { id: string; name: string };
  description: string;
  stock: number;
  status: string;
}


interface CatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function CatalogClient({ initialProducts, categories }: CatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const { addItem } = useCart();

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || product.category.name === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, initialProducts]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Catálogo</h1>
          <p className="text-muted-foreground">Explora productos publicados por nuestra comunidad.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex-1 max-w-lg relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar productos por nombre o descripción..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm group-hover:border-primary/30"
          />
        </div>

        <CategoryManager initialCategories={categories} />
      </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        {['Todos', ...categories.map(c => c.name)].map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300",
              activeCategory === category 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                : "bg-background border border-border hover:border-primary/50 text-muted-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div 
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group flex flex-col bg-card rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Link href={`/store/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-muted">
                  <img 
                    src={product.image || ''} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {product.category.name && (
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-3">
                        {product.category.name}
                      </span>
                    )}
                    <Link href={`/store/${product.id}`}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors cursor-pointer">
                          {product.name}
                        </h3>
                        {product.stock <= 5 && (
                          <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-md">
                            ¡Solo {product.stock} disp.!
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>


                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold">S/. {product.price.toFixed(2)}</span>
                      {(product as any).discount > 0 && (
                        <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md mt-1 w-fit">
                          -{(product as any).discount}%
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => addItem(product)}
                        className="bg-primary/10 text-primary p-3 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
                        title="Añadir al carrito"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-muted/20 rounded-3xl border-2 border-dashed border-border"
            >
              <Ghost className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-1">No hay productos aún</h3>
              <p className="text-muted-foreground">Sé el primero en subir algo al catálogo.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('Todos'); }}
                className="mt-6 text-primary font-medium hover:underline"
              >
                Limpiar búsqueda
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
