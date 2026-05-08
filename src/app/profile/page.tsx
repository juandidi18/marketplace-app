import { auth } from "@/auth";
import { User, Mail, Calendar, Shield, Package, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from "next/navigation";
import db from "@/lib/db";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch extra data from DB
  const user = await db.user.findUnique({
    where: { email: session.user.email as string }
  });

  if (!user) return null;

  const productCount = user.role === 'ADMIN' 
    ? await db.product.count() 
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <Link href="/store" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver a la tienda
        </Link>
        <h1 className="text-4xl font-bold tracking-tight">Mi Perfil</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-[32px] p-8 shadow-xl shadow-primary/5 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-transparent -z-10" />
            
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-background shadow-lg">
              <User className="w-12 h-12" />
            </div>
            
            <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-6">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>

            <div className="flex items-center justify-center gap-2 bg-muted px-4 py-2 rounded-2xl w-fit mx-auto mb-8">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider">{user.role}</span>
            </div>

            <div className="pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              Miembro desde {new Date(user.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:border-primary/30 transition-all group">
              <div className="bg-primary/10 text-primary p-3 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Compras</p>
              <h3 className="text-3xl font-bold">0</h3>
            </div>

            {user.role === 'ADMIN' && (
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:border-primary/30 transition-all group">
                <div className="bg-primary/10 text-primary p-3 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Productos en Tienda</p>
                <h3 className="text-3xl font-bold">{productCount}</h3>
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Acciones de Cuenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-between p-4 rounded-2xl border border-border hover:bg-muted/50 transition-colors text-left group">
                <div>
                  <p className="font-semibold text-sm">Editar Perfil</p>
                  <p className="text-xs text-muted-foreground">Cambia tu nombre o contraseña</p>
                </div>
                <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground" />
              </button>
              
              {user.role === 'ADMIN' && (
                <Link href="/admin/products" className="flex items-center justify-between p-4 rounded-2xl border border-border hover:bg-primary/5 hover:border-primary/30 transition-colors text-left group">
                  <div>
                    <p className="font-semibold text-sm text-primary">Gestionar Tienda</p>
                    <p className="text-xs text-muted-foreground">Ir al panel de inventario</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-primary" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
