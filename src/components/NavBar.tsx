'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Upload, User, LayoutGrid, ShoppingCart, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { useCart } from '@/store/useCart';
import { CartDrawer } from './CartDrawer';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';


export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navItems = [
    { name: 'Catálogo', href: '/store', icon: LayoutGrid },
    { name: 'Ventas', href: '/admin/orders', icon: ShoppingBag, adminOnly: true },
    { name: 'Subir Producto', href: '/upload', icon: Upload, adminOnly: true },

  ];


  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 text-primary p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight">Marketplace.</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-full border border-border/50">
              {navItems.map((item) => {
                if (item.adminOnly && (session?.user as any)?.role !== 'ADMIN') return null;
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors z-10",
                      isActive ? "text-primary dark:text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>


            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors group"
              >
                <ShoppingCart className="w-5 h-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in-50 duration-300">
                    {items.length}
                  </span>
                )}
              </button>
              <ThemeToggle />
              
              {session ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end hidden sm:flex">
                    <Link href="/profile" className="text-xs font-bold hover:text-primary transition-colors cursor-pointer">{session.user?.name}</Link>
                    <span className="text-[10px] text-muted-foreground uppercase">{(session.user as any)?.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    { (session.user as any)?.role === 'ADMIN' && (
                      <Link 
                        href="/admin/products"
                        className="p-2.5 rounded-full bg-muted hover:bg-primary hover:text-white transition-all shadow-sm"
                        title="Panel de Control"
                      >
                        <Shield className="w-5 h-5" />
                      </Link>
                    )}
                    <button 
                      onClick={() => signOut()}
                      className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      Salir
                    </button>
                  </div>
                </div>
              ) : (

                <button 
                  onClick={() => router.push('/login')}
                  className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary transition-colors shadow-lg hover:shadow-primary/25"
                >
                  <User className="w-4 h-4" />
                  Acceder
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
