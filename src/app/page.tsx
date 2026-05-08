import Link from 'next/link';
import { ArrowRight, ShoppingBag, Zap, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { getProducts } from '@/app/actions/productActions';

export default async function Home() {
  const latestProducts = await getProducts({ take: 3 });

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-10 border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Marketplace de Siguiente Generación</span>
          </div>

          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-8 leading-[0.9]">
            COMPRA <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-gradient">DIFERENTE.</span><br />
            VENDE MEJOR.
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            La plataforma líder en Perú para el intercambio de tecnología y productos premium. 
            Seguridad garantizada y experiencia de usuario inmejorable.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/store" className="group w-full sm:w-auto bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
              Ver Catálogo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/upload" className="w-full sm:w-auto bg-card border border-border px-10 py-5 rounded-2xl font-bold text-lg hover:bg-muted transition-all">
              Subir Producto
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-24 bg-muted/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Novedades</h2>
              <p className="text-muted-foreground">Los últimos productos añadidos a nuestra comunidad.</p>
            </div>
            <Link href="/store" className="text-primary font-bold hover:underline flex items-center gap-2">
              Ver todo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestProducts.map((product) => (
              <Link href={`/store/${product.id}`} key={product.id} className="group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-square overflow-hidden relative">
                  <img src={product.image || ''} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

                  {product.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      -{product.discount}%
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md mb-3 inline-block">
                    {product.category?.name || 'General'}
                  </span>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                  </div>
                  <p className="text-2xl font-black">S/. {product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="w-full py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="flex gap-6 items-start">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Venta Inmediata</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">Publica tus productos en segundos y llega a compradores verificados en todo el país.</p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Garantía Asegurada</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">Protección total en cada transacción. Tu seguridad es nuestra prioridad número uno.</p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <ShoppingBag className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Envío Flexible</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">Elige entre múltiples métodos de entrega según tu conveniencia y ubicación.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

