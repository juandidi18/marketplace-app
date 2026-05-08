'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SuccessPage() {
  const params = useParams();
  const orderId = params.id;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full text-center"
      >
        <div className="relative inline-block mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
            className="bg-primary text-primary-foreground p-6 rounded-[2.5rem] shadow-2xl shadow-primary/40 relative z-10"
          >
            <CheckCircle2 className="w-16 h-16" />
          </motion.div>
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-primary rounded-full blur-3xl -z-10"
          />
        </div>

        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
          ¡Gracias por tu compra!
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
          Tu pedido <span className="font-bold text-foreground">#{orderId}</span> ha sido recibido con éxito. Nos pondremos en contacto contigo pronto.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          <div className="bg-card border border-border p-6 rounded-3xl flex flex-col items-center text-center">
            <Package className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold mb-1">Estado del Pedido</h3>
            <p className="text-sm text-muted-foreground">Procesando envío</p>
          </div>
          <div className="bg-card border border-border p-6 rounded-3xl flex flex-col items-center text-center">
            <ShoppingBag className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold mb-1">Siguiente Paso</h3>
            <p className="text-sm text-muted-foreground">Coordinar pago</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href="/store" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group"
          >
            Seguir Comprando
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 px-10 py-5 rounded-2xl font-bold transition-all"
          >
            <Home className="w-4 h-4" />
            Ir al Inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
