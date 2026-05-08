'use client';

import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/app/actions/orderActions';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const data = await getOrders();
    setOrders(data);
    setIsLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      toast.success('Estado actualizado');
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } else {
      toast.error(result.error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'PAID': return <CheckCircle2 className="w-4 h-4" />;
      case 'SHIPPED': return <Truck className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-600';
      case 'PAID': return 'bg-green-500/10 text-green-600';
      case 'SHIPPED': return 'bg-blue-500/10 text-blue-600';
      case 'COMPLETED': return 'bg-gray-500/10 text-gray-600';
      case 'CANCELLED': return 'bg-red-500/10 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'PENDIENTE';
      case 'PAID': return 'PAGADO';
      case 'SHIPPED': return 'ENVIADO';
      case 'COMPLETED': return 'COMPLETADO';
      case 'CANCELLED': return 'CANCELADO';
      default: return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Panel de Ventas</h1>
          <p className="text-muted-foreground">Gestiona los pedidos y el estado de tus entregas.</p>
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 w-full bg-muted animate-pulse rounded-3xl" />
          ))
        ) : orders.length === 0 ? (
          <div className="bg-card border border-border rounded-[32px] p-20 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Aún no hay ventas registradas.</p>
          </div>
        ) : (
          orders.map((order) => (
            <motion.div 
              key={order.id}
              layout
              className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div 
                className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    #{order.id.slice(-4).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{order.customerName}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> {order.items.length} productos</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Total</p>
                    <p className="text-xl font-black">S/. {order.total.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase ${getStatusStyles(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedOrder === order.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border bg-muted/20"
                  >
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                      {/* Customer Details */}
                      <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary">Detalles del Cliente</h4>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-muted-foreground mt-1" />
                            <div>
                              <p className="text-xs text-muted-foreground">Email</p>
                              <p className="text-sm font-medium">{order.customerEmail}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-muted-foreground mt-1" />
                            <div>
                              <p className="text-xs text-muted-foreground">Teléfono</p>
                              <p className="text-sm font-medium">{order.customerPhone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                            <div>
                              <p className="text-xs text-muted-foreground">Dirección</p>
                              <p className="text-sm font-medium leading-relaxed">{order.shippingAddress}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="lg:col-span-1 space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary">Productos</h4>
                        <div className="space-y-4">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-muted border border-border overflow-hidden">
                                <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold line-clamp-1">{item.product.name}</p>
                                <p className="text-xs text-muted-foreground">{item.quantity} x S/. {item.price.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary">Gestionar Estado</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { key: 'PENDING', label: 'PENDIENTE' },
                            { key: 'PAID', label: 'PAGADO' },
                            { key: 'SHIPPED', label: 'ENVIADO' },
                            { key: 'COMPLETED', label: 'COMPLETADO' },
                            { key: 'CANCELLED', label: 'CANCELADO' }
                          ].map((s) => (
                            <button
                              key={s.key}
                              onClick={() => handleStatusChange(order.id, s.key)}
                              className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                                order.status === s.key 
                                ? 'bg-primary border-primary text-primary-foreground' 
                                : 'bg-background border-border hover:border-primary/50 text-muted-foreground'
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

