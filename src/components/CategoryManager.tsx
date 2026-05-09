'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowUp, ArrowDown, Edit2, Check, X, Settings2 } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory, reorderCategories } from '@/app/actions/categoryActions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ConfirmModal from './ui/ConfirmModal';

interface Category {
  id: string;
  name: string;
  order: number;
}

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isOpen, setIsOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [catToDelete, setCatToDelete] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newCatName.trim()) return;
    setIsUpdating(true);
    const res = await createCategory(newCatName);
    if (res.success && res.category) {
      setCategories([...categories, res.category as any]);
      setNewCatName('');
      toast.success('Categoría añadida');
    } else {
      toast.error(res.error);
    }
    setIsUpdating(false);
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    setIsUpdating(true);
    const res = await updateCategory(id, editName);
    if (res.success) {
      setCategories(categories.map(c => c.id === id ? { ...c, name: editName } : c));
      setEditingId(null);
      toast.success('Actualizado');
    }
    setIsUpdating(false);
  };

  const handleDelete = async (id: string) => {
    setCatToDelete(id);
  };

  const confirmDelete = async () => {
    if (!catToDelete) return;
    setIsUpdating(true);
    const res = await deleteCategory(catToDelete);
    if (res.success) {
      setCategories(categories.filter(c => c.id !== catToDelete));
      toast.success('Eliminado');
    } else {
      toast.error(res.error);
    }
    setIsUpdating(false);
    setCatToDelete(null);
  };

  const move = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setCategories(newItems);
    
    // Guardar orden en DB
    await reorderCategories(newItems.map(c => c.id));
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors text-sm font-medium"
      >
        <Settings2 className="w-4 h-4" /> Gestionar Categorías
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                <h2 className="text-xl font-bold">Categorías</h2>
                <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Nueva categoría..."
                    className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button 
                    onClick={handleAdd}
                    disabled={isUpdating}
                    className="p-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {categories.map((cat, index) => (
                    <motion.div 
                      key={cat.id} 
                      layout
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl border border-transparent hover:border-border transition-colors group"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex flex-col gap-1">
                          <button onClick={() => move(index, 'up')} className="p-0.5 hover:bg-background rounded disabled:opacity-30" disabled={index === 0}><ArrowUp className="w-3 h-3" /></button>
                          <button onClick={() => move(index, 'down')} className="p-0.5 hover:bg-background rounded disabled:opacity-30" disabled={index === categories.length - 1}><ArrowDown className="w-3 h-3" /></button>
                        </div>
                        
                        {editingId === cat.id ? (
                          <div className="flex items-center gap-1 flex-1">
                            <input 
                              autoFocus
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="bg-background border border-border rounded-lg px-2 py-1 text-sm flex-1"
                            />
                            <button onClick={() => handleRename(cat.id)} className="text-green-500"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingId(null)} className="text-red-500"><X className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <span className="text-sm font-medium">{cat.name}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                          className="p-2 text-muted-foreground hover:text-blue-500"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!catToDelete}
        onClose={() => setCatToDelete(null)}
        onConfirm={confirmDelete}
        title="¿Eliminar categoría?"
        message="Esta acción solo funcionará si la categoría no tiene productos asociados."
        confirmText="Eliminar"
        variant="danger"
      />
    </>
  );
}
