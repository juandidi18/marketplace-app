'use client';

import { useState } from 'react';
import { useCart } from '@/store/useCart';
import { createOrder } from '@/app/actions/orderActions';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
  });

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        customerName: session.user?.name || '',
        customerEmail: session.user?.email || '',
      }));
    }
  }, [session]);


  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
        <p className="text-muted-foreground mb-8">Agrega algunos productos antes de continuar al pago.</p>
        <Link href="/store" className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await createOrder({
      ...formData,
      items,
      total,
      userId: (session?.user as any)?.id
    });


    if (result.success) {
      toast.success('¡Pedido realizado con éxito!');
      clearCart();
      router.push(`/checkout/success/${result.orderId}`);
    } else {
      toast.error(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <Link href="/store" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-10 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Form */}
        <div className="lg:col-span-7">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-8 tracking-tight">Finalizar Compra</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/10 p-2 rounded-xl">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">Información de Envío</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Nombre Completo</label>
                    <input 
                      required
                      type="text"
                      placeholder="Juan Pérez"
                      className="w-full bg-background border border-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Correo Electrónico</label>
                    <input 
                      required
                      type="email"
                      placeholder="juan@ejemplo.com"
                      className="w-full bg-background border border-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Teléfono de Contacto</label>
                  <input 
                    required
                    type="tel"
                    placeholder="+51 987 654 321"
                    className="w-full bg-background border border-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Dirección de Entrega</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Av. Las Flores 123, Miraflores, Lima"
                    className="w-full bg-background border border-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/10 p-2 rounded-xl">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">Método de Pago</h2>
                </div>

                <div className="p-6 rounded-2xl border-2 border-primary bg-primary/5 flex items-center justify-between">
                  <div>
                    <p className="font-bold">Pago por Transferencia / Contra Entrega</p>
                    <p className="text-xs text-muted-foreground mt-1">Nos contactaremos contigo para coordinar el pago.</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground py-6 rounded-[2rem] font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
              >
                {isSubmitting ? 'Procesando Pedido...' : `Confirmar Pedido (S/. ${total.toFixed(2)})`}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-card border border-border p-8 rounded-[2.5rem] shadow-sm">
            <h3 className="text-xl font-bold mb-8">Resumen del Pedido</h3>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-8 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                    <p className="text-sm font-bold mt-1">S/. {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>S/. {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Envío</span>
                <span className="text-green-500 font-bold uppercase text-xs">Gratis</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t border-border">
                <span>Total</span>
                <span>S/. {total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-start gap-3">
              <div className="bg-background p-1.5 rounded-lg border border-border mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-primary" />
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Al confirmar tu pedido, aceptas nuestros términos de servicio y políticas de privacidad. Tu información está protegida.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
