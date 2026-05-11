'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Upload, User, LayoutGrid, ShoppingCart, Shield, Menu, X, LogOut } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Catálogo', href: '/store', icon: LayoutGrid },
    { name: 'Ventas', href: '/admin/orders', icon: ShoppingBag, adminOnly: true },
    { name: 'Subir Producto', href: '/upload', icon: Upload, adminOnly: true },

  ];


  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 group">
            <div className="bg-primary/10 text-primary p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight">Marketplace.</span>
          </Link>
          
          {/* Desktop Navigation */}
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

          {/* Mobile Actions & Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors group"
            >
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {items.length}
                </span>
              )}
            </button>
            <ThemeToggle />
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-border/50 bg-background overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    if (item.adminOnly && (session?.user as any)?.role !== 'ADMIN') return null;
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>

                <div className="h-px bg-border/50 my-2" />

                {session ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold hover:text-primary transition-colors">
                          {session.user?.name}
                        </Link>
                        <span className="text-[10px] text-muted-foreground uppercase">{(session.user as any)?.role}</span>
                      </div>
                    </div>
                    { (session.user as any)?.role === 'ADMIN' && (
                      <Link 
                        href="/admin/products"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <Shield className="w-5 h-5" />
                        Panel de Control
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      Salir
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push('/login');
                    }}
                    className="flex items-center justify-center gap-2 bg-foreground text-background px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary transition-colors w-full"
                  >
                    <User className="w-5 h-5" />
                    Acceder
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
