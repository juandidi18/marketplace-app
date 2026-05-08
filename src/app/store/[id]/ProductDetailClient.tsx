'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


import { motion, AnimatePresence } from 'framer-motion';

import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RotateCcw, Star } from 'lucide-react';
import { useCart } from '@/store/useCart';

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  
  const images = product.images?.length > 0 
    ? product.images 
    : [{ url: product.image || '' }];

  const [activeImage, setActiveImage] = useState(images[0]?.url || '');


  const isFromAdmin = searchParams.get('from') === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button 
        onClick={() => isFromAdmin ? router.push('/admin/products') : router.back()}
        className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {isFromAdmin ? 'Volver al panel' : 'Volver al catálogo'}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-muted border border-border shadow-inner group">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                src={activeImage} alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </AnimatePresence>
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img: any, i: number) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImage(img.url)}
                  className={`aspect-square rounded-2xl overflow-hidden bg-muted border-2 transition-all cursor-pointer ${
                    activeImage === img.url ? 'border-primary shadow-lg scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </motion.div>


        {/* Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="flex items-center gap-2 mb-4">
            {product.category?.name && (
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {product.category.name}
              </span>
            )}
            <div className="flex items-center gap-1 text-yellow-500 ml-2">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold text-foreground">{product.rating?.toFixed(1) || '5.0'}</span>
              <span className="text-sm text-muted-foreground font-normal">({product.reviewCount || 0} reseñas)</span>
            </div>
          </div>


          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            {product.name}
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {product.description || `Experimenta la máxima calidad con este ${product.name.toLowerCase()}. Diseñado para ofrecer rendimiento, durabilidad y estilo inigualables en su categoría.`}
          </p>

          <div className="flex items-end gap-3 mb-10">
            <span className="text-4xl font-bold">S/. {product.price.toFixed(2)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through mb-1">
                  S/. {(product.price / (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-lg text-xs font-bold mb-1.5">
                  -{product.discount}% Hoy
                </span>
              </>
            )}
          </div>


          <div className="space-y-4 mb-10">
            {product.hasFreeShipping && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                <div className="bg-background p-2 rounded-xl border border-border">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide">Envío Gratis</p>
                  <p className="text-xs text-muted-foreground">Llega en 2-4 días hábiles</p>
                </div>
              </div>
            )}
            {product.hasWarranty && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                <div className="bg-background p-2 rounded-xl border border-border">
                  <RotateCcw className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide">Garantía Extendida</p>
                  <p className="text-xs text-muted-foreground">30 días de devolución asegurada</p>
                </div>
              </div>
            )}
          </div>


          {!isFromAdmin && (
            <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => addItem(product)}
                className="flex items-center justify-center gap-3 bg-primary text-primary-foreground py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                <ShoppingCart className="w-5 h-5" />
                Añadir al Carrito
              </button>
              <button className="flex items-center justify-center gap-3 bg-foreground text-background py-5 rounded-2xl font-bold hover:bg-foreground/90 transition-all active:scale-[0.98]">
                Comprar Ahora
              </button>
            </div>
          )}
          {isFromAdmin && (
            <div className="mt-auto p-6 bg-muted/50 border-2 border-dashed border-border rounded-[2rem] text-center">
              <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="font-bold text-sm uppercase tracking-wider mb-1">Vista Previa de Admin</p>
              <p className="text-xs text-muted-foreground">Los controles de compra están desactivados en este modo.</p>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
