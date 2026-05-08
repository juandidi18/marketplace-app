'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, DollarSign, Tag, FileText, X, Star, Truck, ShieldCheck } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/app/actions/uploadActions';
import { useEffect } from 'react';

interface ProductData {
  id?: string;
  name: string;
  price: number | string;
  category: string;
  description: string;
  image: string;
  stock: number | string;
  status: string;
  discount?: number | string;
  rating?: number | string;
  reviewCount?: number | string;
  hasFreeShipping?: boolean;
  hasWarranty?: boolean;
  images?: any[];
}




interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: ProductData;
  categories: Category[];
  onSubmit: (data: any) => Promise<{ success: boolean; error?: string }>;
  onSuccess?: () => void;
  title: string;
  buttonText: string;
}


export default function ProductForm({ initialData, categories, onSubmit, onSuccess, title, buttonText }: ProductFormProps) {

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price?.toString() || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    stock: initialData?.stock?.toString() || '0',
    status: initialData?.status || 'ACTIVE',
    discount: initialData?.discount?.toString() || '0',
    rating: initialData?.rating?.toString() || '5.0',
    reviewCount: initialData?.reviewCount?.toString() || '0',
    hasFreeShipping: (initialData?.hasFreeShipping === true) as boolean,
    hasWarranty: (initialData?.hasWarranty !== false) as boolean
  });



  
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images?.map((img: any) => img.url) || (initialData?.image ? [initialData.image] : []));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`La imagen ${file.name} pesa más de 5MB`);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category || !formData.description || imagePreviews.length === 0) {
      toast.warning('Por favor completa todos los campos e incluye al menos una imagen');
      return;
    }

    setIsSubmitting(true);
    
    try {
      toast.loading('Subiendo imágenes a la nube...', { id: 'upload-toast' });
      
      const uploadedUrls = await Promise.all(
        imagePreviews.map(async (img) => {
          if (img.startsWith('data:image')) {
            const res = await uploadImage(img);
            if (res.success && res.url) return res.url;
            throw new Error(res.error || 'Error al subir imagen');
          }
          return img;
        })
      );

      toast.dismiss('upload-toast');

      const result = await onSubmit({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock.toString()),
        images: uploadedUrls,
        categoryId: formData.category
      });



      if (result.success) {
        toast.success('¡Operación realizada con éxito!');
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/store');
        }
        router.refresh();
      } else {
        toast.error(result.error || 'Hubo un error');
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>
        <p className="text-muted-foreground">Carga múltiples fotos para mostrar todos los ángulos de tu producto.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border p-8 rounded-3xl shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Información Básica
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre del Producto</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. MacBook Pro 2023 M2..."
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    Precio
                  </label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    Stock
                  </label>
                  <input 
                    type="number" 
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    Categoría <Tag className="w-4 h-4 text-muted-foreground" />
                  </label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="">Selecciona...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    Estado
                  </label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="ACTIVE">Activo</option>
                      <option value="DRAFT">Borrador</option>
                      <option value="ARCHIVED">Archivado</option>
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe las características principales..."
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none text-sm leading-relaxed"
                ></textarea>
              </div>

            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-card border border-border p-8 rounded-3xl shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" /> Marketing y Beneficios
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    Descuento (%)
                  </label>
                  <input 
                    type="number" 
                    value={formData.discount || 0}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="0"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <input 
                      type="number" 
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating || 5.0}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Reseñas</label>
                    <input 
                      type="number" 
                      value={formData.reviewCount || 0}
                      onChange={(e) => setFormData({ ...formData, reviewCount: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-bold">Envío Gratis</p>
                      <p className="text-[10px] text-muted-foreground">Activa la etiqueta de envío gratuito</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={formData.hasFreeShipping}
                    onChange={(e) => setFormData({ ...formData, hasFreeShipping: e.target.checked })}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-bold">Garantía Extendida</p>
                      <p className="text-[10px] text-muted-foreground">Muestra 30 días de devolución</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={formData.hasWarranty}
                    onChange={(e) => setFormData({ ...formData, hasWarranty: e.target.checked })}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="sticky top-28"
          >
            <div className="bg-card border border-border p-6 rounded-3xl shadow-sm mb-6">

              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" /> Galería de Fotos
              </h2>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <AnimatePresence>
                  {imagePreviews.map((src, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                      className="relative aspect-square rounded-2xl overflow-hidden border border-border group"
                    >
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1.5 right-1.5 bg-black/60 text-white p-1 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-[8px] text-white font-bold text-center py-1 uppercase tracking-wider">
                          Principal
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors group"
                >
                  <UploadCloud className="w-6 h-6 text-primary mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Añadir</span>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden" 
                    accept="image/*" 
                    multiple
                  />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-[10px] text-muted-foreground leading-tight">
                <p>💡 La primera imagen será la portada de tu producto.</p>
              </div>
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {isSubmitting ? 'Guardando...' : buttonText}
            </button>
          </motion.div>
        </div>
      </form>
    </div>
  );
}

