import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: { id: string; name: string } | string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          const updatedItems = items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
          set({ items: updatedItems, total: calculateTotal(updatedItems) });
        } else {
          const updatedItems = [...items, { ...product, quantity: 1 }];
          set({ items: updatedItems, total: calculateTotal(updatedItems) });
        }
        toast.success(`${product.name} añadido al carrito`);
      },
      removeItem: (productId) => {
        const items = get().items;
        const product = items.find((p) => p.id === productId);
        const updatedItems = items.filter((item) => item.id !== productId);
        set({ items: updatedItems, total: calculateTotal(updatedItems) });
        if (product) toast.info(`${product.name} eliminado del carrito`);
      },
      updateQuantity: (productId, quantity) => {
        const items = get().items;
        const updatedItems = items.map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        );
        set({ items: updatedItems, total: calculateTotal(updatedItems) });
      },
      clearCart: () => {
        set({ items: [], total: 0 });
        toast.info("Carrito vaciado");
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};
