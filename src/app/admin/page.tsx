"use client";
import React, { useState, useEffect } from 'react';
import { Product, Category, Order, OrderStatus } from '../../types';
import { 
  DollarSign, ShoppingCart, AlertCircle, Key,
  Plus, CheckCircle2, RefreshCw, User, Phone, MapPin
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ADMIN_PINS, DEFAULT_PRODUCT_PRICE, DEFAULT_PRODUCT_SIZES, DEFAULT_PRODUCT_COLORS, DEFAULT_PRODUCT_STOCK } from '../../config/constants';

interface Stats {
  revenue: number;
  ordersCount: number;
  statusCounts: {
    Pending: number;
    Confirmed: number;
    Delivered: number;
    Cancelled: number;
  };
  categoryStats: Array<{ category: string; label: string; value: number }>;
  lowStockItems: Array<{ id: string; name: string; stock: number }>;
}

export default function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'products' | 'categories'>('overview');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: DEFAULT_PRODUCT_PRICE,
    category: 'clothes',
    imageUrls: '',
    sizes: DEFAULT_PRODUCT_SIZES,
    colors: DEFAULT_PRODUCT_COLORS,
    stock: DEFAULT_PRODUCT_STOCK,
    featured: false,
    newArrival: true
  });

  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (ADMIN_PINS.includes(pinCode)) {
      setAuthorized(true);
      fetchAdminData();
    } else {
      setLoginError('INVALID SECURE PIN. PLEASE TRY AGAIN!');
    }
  };

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [pRes, cRes, oRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false })
      ]);

      const fetchedProducts = pRes.data as Product[] || [];
      const fetchedCategories = cRes.data as Category[] || [];
      const fetchedOrders = oRes.data as Order[] || [];

      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setOrders(fetchedOrders);

      // Compute stats
      const statusCounts = { Pending: 0, Confirmed: 0, Delivered: 0, Cancelled: 0 };
      let revenue = 0;

      fetchedOrders.forEach((o) => {
        if (['Pending', 'Confirmed', 'Delivered', 'Cancelled'].includes(o.status)) {
          statusCounts[o.status as keyof typeof statusCounts]++;
        }
        if (o.status !== 'Cancelled') {
          revenue += Number(o.total_price);
        }
      });

      const lowStockItems = fetchedProducts.filter(p => p.stock <= 5).map(p => ({ id: p.id, name: p.name, stock: p.stock }));

      setStats({
        revenue,
        ordersCount: fetchedOrders.length,
        statusCounts,
        categoryStats: [],
        lowStockItems
      });

    } catch (err) {
      // Error fetching dashboard data - display to user
      console.error('Dashboard fetch error:', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) {
      fetchAdminData();
    }
  }, [authorized]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (!error) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        fetchAdminData();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      // Handle error updating order status silently
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order record?')) return;
    try {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (!error) {
        setOrders(orders.filter(o => o.id !== orderId));
        setSelectedOrder(null);
        fetchAdminData();
      }
    } catch (err) {
      // Handle error deleting order silently
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArray = formData.colors.split(',').map(c => c.trim()).filter(Boolean);
    const imagesArray = formData.imageUrls.split('\n').map(img => img.trim()).filter(Boolean);

    if (imagesArray.length === 0) {
      imagesArray.push('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800');
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      images: imagesArray,
      sizes: sizesArray,
      colors: colorsArray,
      stock: Number(formData.stock),
      featured: formData.featured,
      newArrival: formData.newArrival
    };

    try {
      let error;
      if (editingProduct) {
        const res = await supabase.from('products').update(payload).eq('id', editingProduct.id);
        error = res.error;
      } else {
        const newId = `prod_${Date.now()}`;
        const res = await supabase.from('products').insert({ id: newId, ...payload });
        error = res.error;
      }

      if (!error) {
        setEditingProduct(null);
        setIsAddingProduct(false);
        setFormData({
          name: '',
          description: '',
          price: DEFAULT_PRODUCT_PRICE,
          category: 'clothes',
          imageUrls: '',
          sizes: DEFAULT_PRODUCT_SIZES,
          colors: DEFAULT_PRODUCT_COLORS,
          stock: DEFAULT_PRODUCT_STOCK,
          featured: false,
          newArrival: true
        });
        fetchAdminData();
      }
    } catch (err) {
      // Handle error saving product silently
    }
  };

  const handleStartEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsAddingProduct(true);
    setFormData({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      category: prod.category,
      imageUrls: prod.images.join('\n'),
      sizes: prod.sizes.join(','),
      colors: prod.colors.join(','),
      stock: prod.stock,
      featured: prod.featured || false,
      newArrival: prod.newArrival || false
    });
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!window.confirm('Delete this product from your catalog?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', prodId);
      if (!error) {
        fetchAdminData();
      }
    } catch (err) {
      // Handle error deleting product silently
    }
  };

  const handleAddNewCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const payload = {
      id: newCatName.toLowerCase().replace(/\s+/g, '-'),
      name: newCatName,
      image: newCatImage.trim() || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
    };

    try {
      const { error } = await supabase.from('categories').insert(payload);
      if (!error) {
        setNewCatName('');
        setNewCatImage('');
        fetchAdminData();
      }
    } catch (err) {
      // Handle error adding category silently
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!window.confirm('Delete this category? Products matching it will lose connection.')) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', catId);
      if (!error) {
        fetchAdminData();
      }
    } catch (err) {
      // Handle error deleting category silently
    }
  };

  if (!authorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 select-none">
        <form onSubmit={handleLogin} className="bg-white border border-gray-100 p-8 shadow-xl text-center space-y-6">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full mx-auto">
            <Key className="w-5.5 h-5.5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-[0.3em] font-display text-black uppercase">
              BADR SECURE GATE
            </h2>
            <p className="text-[11px] text-gray-400 font-mono mt-1">
              STOREADMIN DASHBOARD ACCESS
            </p>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-500 text-[10px] py-2 px-3 font-semibold font-mono tracking-wider uppercase">
              {loginError}
            </div>
          )}

          <div className="space-y-2 text-left">
            <label className="text-[10px] font-mono tracking-widest text-gray-500 font-bold uppercase block">
              ENTER SECURE PIN
            </label>
            <input
              type="password"
              required
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              placeholder="Ex: 2026"
              className="w-full bg-white border border-gray-200 p-3 text-center tracking-[1em] focus:outline-none focus:border-black font-semibold text-lg"
            />
            <p className="text-[9px] text-gray-400 font-mono text-center pt-1 leading-normal">
              PIN Hint: Use <strong className="text-black">2026</strong> or <strong className="text-black">1234</strong>
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-stone-800 text-white font-medium text-xs tracking-[0.2em] py-3.5 uppercase transition-colors cursor-pointer"
          >
            VERIFY CREDENTIALS
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200/80 pb-6 mb-8 select-none">
        <div>
          <h1 className="text-2xl font-display font-medium tracking-widest text-black uppercase">
            STORE MANAGEMENT PANEL
          </h1>
          <p className="text-[10px] text-gray-400 tracking-wider font-mono uppercase mt-1">
            Real-time sales, order fulfillment logs, and dynamic catalog database config
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={isLoading}
          className="mt-4 md:mt-0 bg-white hover:bg-gray-50 text-black py-2.5 px-5 text-[10px] tracking-widest font-bold font-mono border border-gray-200 flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'SYNCING...' : 'REFRESH DATABASE'}</span>
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 select-none">
          <div className="bg-white border border-gray-100 p-5 rounded-md flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[9px] text-gray-400 tracking-widest font-mono uppercase block">REVENUE (LOGGED)</span>
              <span className="text-xl font-mono font-bold text-gray-950">{stats.revenue} DH</span>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-5 rounded-md flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[9px] text-gray-400 tracking-widest font-mono uppercase block">TOTAL ORDERS</span>
              <span className="text-xl font-mono font-bold text-gray-950">{stats.ordersCount}</span>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-5 rounded-md flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[9px] text-gray-400 tracking-widest font-mono uppercase block">PENDING ORDERS</span>
              <span className="text-xl font-mono font-bold text-gray-950">{stats.statusCounts.Pending}</span>
            </div>
            <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-5 rounded-md flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[9px] text-gray-400 tracking-widest font-mono uppercase block">DELIVERED</span>
              <span className="text-xl font-mono font-bold text-gray-950">{stats.statusCounts.Delivered}</span>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {stats && stats.lowStockItems.length > 0 && (
        <div className="mb-8 bg-amber-50 border border-amber-200/80 p-4 rounded-md flex items-start space-x-3 text-xs select-none">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-grow">
            <p className="font-bold text-stone-900 uppercase tracking-wider font-mono">CRITICAL INVENTORY WARNING</p>
            <div className="flex flex-wrap gap-2.5 mt-2.5">
              {stats.lowStockItems.map(p => (
                <span key={p.id} className="bg-stone-900 text-white font-mono text-[9px] tracking-wider px-2.5 py-1 uppercase rounded-xs">
                  {p.name}: <strong className="text-amber-300 font-mono">{p.stock} units</strong>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex bg-gray-100 p-1.5 mb-8 rounded-md max-w-md select-none">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex-1 text-center py-2.5 text-[10px] tracking-widest font-bold font-mono uppercase rounded-xs transition-colors cursor-pointer ${
            activeSubTab === 'overview' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
          }`}
        >
          ORDERS LOGS
        </button>
        <button
          onClick={() => setActiveSubTab('products')}
          className={`flex-1 text-center py-2.5 text-[10px] tracking-widest font-bold font-mono uppercase rounded-xs transition-colors cursor-pointer ${
            activeSubTab === 'products' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
          }`}
        >
          INVENTORY MANAGE
        </button>
        <button
          onClick={() => setActiveSubTab('categories')}
          className={`flex-1 text-center py-2.5 text-[10px] tracking-widest font-bold font-mono uppercase rounded-xs transition-colors cursor-pointer ${
            activeSubTab === 'categories' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
          }`}
        >
          CATEGORIES
        </button>
      </div>

      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 bg-white border border-gray-100 rounded-md p-6 shadow-xs h-auto">
            <h3 className="text-xs tracking-widest font-bold font-mono uppercase text-black pb-4 border-b border-gray-100">
              SAVED ORDERS LIST ({orders.length})
            </h3>
            {orders.length === 0 ? (
              <div className="py-20 text-center text-gray-400 font-mono text-xs">
                NO ORDERS PLACED YET
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-sans mt-3">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      <th className="py-3 px-2">ID</th>
                      <th className="py-3 px-2">CUSTOMER</th>
                      <th className="py-3 px-2">CITY</th>
                      <th className="py-3 px-2 font-mono">TOTAL</th>
                      <th className="py-3 px-2">STATUS</th>
                      <th className="py-3 px-2 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {orders.map((ord) => {
                      let tagBg = 'bg-amber-50 text-amber-800 border-amber-200';
                      if (ord.status === 'Confirmed') tagBg = 'bg-blue-50 text-blue-800 border-blue-200';
                      if (ord.status === 'Delivered') tagBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                      if (ord.status === 'Cancelled') tagBg = 'bg-gray-100 text-gray-500 border-gray-300';
                      return (
                        <tr key={ord.id} className="hover:bg-gray-50/50">
                          <td className="py-4.5 px-2 font-mono font-bold text-stone-900 select-all">
                            #{ord.id}
                          </td>
                          <td className="py-4.5 px-2 font-medium">
                            <p className="text-black font-semibold">{ord.customer_name}</p>
                            <p className="text-[10px] text-gray-400 font-mono">{ord.phone}</p>
                          </td>
                          <td className="py-4.5 px-2 font-mono truncate max-w-[120px]">
                            {ord.city}
                          </td>
                          <td className="py-4.5 px-2 font-semibold font-mono text-black">
                            {ord.total_price} DH
                          </td>
                          <td className="py-4.5 px-2">
                            <span className={`text-[9px] font-mono tracking-wider px-2 py-1 uppercase border rounded-xs ${tagBg}`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-4.5 px-2 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="text-black hover:bg-gray-100 p-1.5 border border-stone-200 inline-flex items-center justify-center cursor-pointer font-mono text-[9px] tracking-wider uppercase font-bold"
                            >
                              DETAIL
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="xl:col-span-4 select-none">
            {selectedOrder ? (
              <div className="bg-white border border-black p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <span className="font-mono text-xs font-semibold text-black">ORDER DETAILS</span>
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                    className="text-red-500 hover:text-red-700 font-mono text-[10px] tracking-wider font-bold"
                  >
                    DELETE
                  </button>
                </div>
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4 font-mono">
                    <div>
                      <span className="text-gray-400 uppercase text-[9px] block">REF</span>
                      <strong className="text-black text-sm uppercase">#{selectedOrder.id}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase text-[9px] block">ORDER DATE</span>
                      <span className="text-stone-900">{new Date(selectedOrder.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-b border-gray-100 py-3.5">
                    <p className="flex items-center space-x-2 text-[11px]">
                      <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <strong className="text-black select-all">{selectedOrder.customer_name}</strong>
                    </p>
                    <p className="flex items-center space-x-2 text-[11px] font-mono">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-blue-600 select-all hover:underline">{selectedOrder.phone}</span>
                    </p>
                    <p className="flex items-start space-x-2 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <span className="text-gray-600 font-semibold select-all">{selectedOrder.city}, {selectedOrder.address}</span>
                    </p>
                  </div>
                  {selectedOrder.notes && (
                    <div className="bg-stone-50 p-3 border font-mono text-[10px] text-stone-605">
                      <span className="block font-bold text-black uppercase mb-1">COURIER NOTE:</span>
                      "{selectedOrder.notes}"
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#555] font-bold uppercase block mb-2">PACKED MERCHANDISE</span>
                    <div className="divide-y divide-gray-100 border border-gray-100 max-h-[25vh] overflow-y-auto p-2 rounded-xs">
                      {selectedOrder.items.map((item: any, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <img src={item.product_image} alt="" className="w-8 aspect-[3/4] object-cover bg-gray-100 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-black truncate max-w-[150px] uppercase font-display text-[10px]">{item.product_name}</p>
                              <p className="text-[9px] font-mono text-gray-400 uppercase">Size: {item.size} / Col: {item.color}</p>
                            </div>
                          </div>
                          <span className="font-mono text-[11px] font-bold text-gray-900 whitespace-nowrap">
                            {item.quantity}x {item.price} DH
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-gray-100 pt-4">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-black uppercase block mb-1">UPDATE FULFILLMENT STATUS</span>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Pending', 'Confirmed', 'Delivered', 'Cancelled'] as OrderStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                          className={`py-2 text-[9px] font-mono tracking-wider font-bold uppercase border cursor-pointer ${
                            selectedOrder.status === st ? 'bg-black text-white border-black' : 'bg-white hover:bg-stone-50 text-gray-500 border-gray-200'
                          }`}
                        >
                          {st === 'Pending' ? 'Pending (COD)' : st.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-gray-200 py-24 text-center text-gray-400 font-mono text-xs shadow-xs rounded-md bg-white">
                SELECT AN ORDER TO MANAGE SHIPMENT
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'products' && (
        <div className="space-y-8 select-none">
          <div className="flex justify-between items-center bg-stone-900 text-white p-4.5 rounded-md">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest">PRODUCT INVENTORY</p>
              <p className="text-[10px] font-sans text-stone-300 mt-1">Catalog items count: {products.length}</p>
            </div>
            <button
              onClick={() => { setEditingProduct(null); setIsAddingProduct(!isAddingProduct); }}
              className="bg-white hover:bg-stone-100 text-black py-2.5 px-5 text-[10px] tracking-widest font-bold font-mono uppercase inline-flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{isAddingProduct && !editingProduct ? 'COLLAPSE' : 'ADD NEW'}</span>
            </button>
          </div>

          {isAddingProduct && (
            <form onSubmit={handleSaveProduct} className="bg-white border border-black p-6 shadow-xl divide-y divide-gray-100">
              <div className="pb-5">
                <h3 className="text-xs tracking-widest font-bold font-mono text-black uppercase">
                  {editingProduct ? `EDIT [REF: ${editingProduct.id}]` : 'ADD NEW CATALOG CLOTHING'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-5 text-xs font-mono">
                <div className="flex flex-col space-y-2">
                  <label className="text-black font-bold uppercase tracking-wider">PRODUCT NAME <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="border p-3 focus:border-black" />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-black font-bold uppercase tracking-wider">PRICE (DH) <span className="text-red-500">*</span></label>
                  <input type="number" required min={1} value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="border p-3 focus:border-black" />
                </div>
                <div className="flex flex-col space-y-2 md:col-span-2">
                  <label className="text-black font-bold uppercase tracking-wider">DESCRIPTION <span className="text-red-500">*</span></label>
                  <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={2} className="border p-3 focus:border-black"></textarea>
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-black font-bold uppercase tracking-wider">CATEGORY <span className="text-red-500">*</span></label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="border p-3 focus:border-black">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-black font-bold uppercase tracking-wider">STOCK LIMIT <span className="text-red-500">*</span></label>
                  <input type="number" required min={0} value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="border p-3 focus:border-black" />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-black font-bold uppercase tracking-wider">SIZES (COMMA SEPARATE) <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.sizes} onChange={e => setFormData({ ...formData, sizes: e.target.value })} className="border p-3 focus:border-black" />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-black font-bold uppercase tracking-wider">COLORS (COMMA SEPARATE) <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.colors} onChange={e => setFormData({ ...formData, colors: e.target.value })} className="border p-3 focus:border-black" />
                </div>
                <div className="flex flex-col space-y-2 md:col-span-2">
                  <label className="text-black font-bold uppercase tracking-wider">IMAGE URLS (ONE PER LINE) <span className="text-red-500">*</span></label>
                  <textarea required value={formData.imageUrls} onChange={e => setFormData({ ...formData, imageUrls: e.target.value })} rows={2} className="border p-3 focus:border-black"></textarea>
                </div>
                <div className="flex space-x-6 md:col-span-2 pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className="rounded-xs" />
                    <span className="font-bold uppercase tracking-wider text-[11px] text-stone-800">PROMOTE TO FEATURED</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={formData.newArrival} onChange={e => setFormData({ ...formData, newArrival: e.target.checked })} className="rounded-xs" />
                    <span className="font-bold uppercase tracking-wider text-[11px] text-stone-800">MARK AS 'NEW ARRIVAL'</span>
                  </label>
                </div>
              </div>
              <div className="pt-5 flex justify-end space-x-3.5">
                <button type="button" onClick={() => setIsAddingProduct(false)} className="bg-white hover:bg-gray-100 border p-2.5 px-6 font-bold text-[10px] font-mono uppercase">CANCEL</button>
                <button type="submit" className="bg-black text-white hover:bg-stone-800 p-2.5 px-8 font-bold text-[10px] font-mono uppercase">SAVE PRODUCT</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {products.map(p => (
              <div key={p.id} className="bg-white border shadow-xs">
                <img src={p.images[0]} alt={p.name} className="w-full aspect-[4/5] object-cover" />
                <div className="p-4 flex flex-col h-[160px] justify-between">
                  <div>
                    <h4 className="font-display font-medium text-xs uppercase truncate">{p.name}</h4>
                    <p className="font-mono text-[10px] text-gray-500 mt-1">{p.price} DH | Stock: {p.stock}</p>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <button onClick={() => handleStartEditProduct(p)} className="text-blue-600 hover:text-blue-800 text-[10px] font-mono font-bold">EDIT</button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:text-red-700 text-[10px] font-mono font-bold">DELETE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'categories' && (
        <div className="space-y-8 select-none">
          <div className="bg-white border border-gray-200 p-6 shadow-xs">
            <h3 className="text-xs tracking-widest font-bold font-mono text-black uppercase mb-4">ADD NEW CATEGORY DIRECTORY</h3>
            <form onSubmit={handleAddNewCategory} className="flex flex-col sm:flex-row sm:items-end gap-4 font-mono text-xs">
              <div className="flex-1 flex flex-col space-y-1.5">
                <label className="text-black font-bold uppercase tracking-wider">CATEGORY NAME</label>
                <input type="text" required value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Ex: Outerwear" className="border p-3 focus:border-black" />
              </div>
              <div className="flex-1 flex flex-col space-y-1.5">
                <label className="text-black font-bold uppercase tracking-wider">COVER IMAGE URL</label>
                <input type="text" required value={newCatImage} onChange={e => setNewCatImage(e.target.value)} placeholder="https://..." className="border p-3 focus:border-black" />
              </div>
              <button type="submit" className="bg-black text-white hover:bg-stone-800 p-3 px-8 font-bold text-[10px] uppercase">ADD RECORD</button>
            </form>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map(c => (
              <div key={c.id} className="relative group overflow-hidden border">
                <img src={c.image} alt={c.name} className="w-full aspect-[16/9] object-cover brightness-75" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <span className="text-white font-display uppercase tracking-widest text-lg font-semibold drop-shadow-md">{c.name}</span>
                  <button onClick={() => handleDeleteCategory(c.id)} className="mt-3 bg-red-600 hover:bg-red-500 text-white font-mono text-[9px] px-3 py-1 uppercase opacity-0 group-hover:opacity-100 transition-opacity">DELETE</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
