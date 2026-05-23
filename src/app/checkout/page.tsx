"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '../../types';
import { Landmark, ArrowLeft, Truck, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase';
import { WHATSAPP_PHONE } from '../../config/constants';

export default function Checkout() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [placedOrderDetails, setPlacedOrderDetails] = useState<Order | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!name.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      setErrorMsg('PLEASE FILL ALL THE REQUIRED FIELDS');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const itemsPayload = cartItems.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images[0],
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
        price: item.product.price
      }));

      const newOrderId = `ord_${Date.now()}`;

      const { data, error } = await supabase
        .from('orders')
        .insert({
          id: newOrderId,
          customer_name: name,
          phone,
          city,
          address,
          total_price: subtotal,
          notes,
          items: itemsPayload,
          status: 'Pending'
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setPlacedOrderDetails(data as Order);
      clearCart();
    } catch (err) {
      // Error occurred while creating order
      setErrorMsg('Something went wrong securely creating your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendWhatsAppConfirmation = () => {
    if (!placedOrderDetails) return;
    
    const itemsList = placedOrderDetails.items
      .map(item => `- ${item.quantity}x ${item.product_name} (${item.size}/${item.color})`)
      .join('\n');

    const message = `Salam BADR, I just placed an order!
Order ID: #${placedOrderDetails.id}
Customer Name: ${placedOrderDetails.customer_name}
Deliver to: ${placedOrderDetails.city}, ${placedOrderDetails.address}
Phone: ${placedOrderDetails.phone}

Items Ordered:
${itemsList}

Total: ${placedOrderDetails.total_price} DH
Status: Cash On Delivery (Pending confirmation)
Notes: ${placedOrderDetails.notes || 'None'}`;

    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, '_blank', 'noreferrer');
  };

  if (placedOrderDetails) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-8 py-16 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-emerald-600 stroke-[3]" />
        </div>

        <h2 className="text-xl sm:text-2xl font-display font-medium text-stone-900 tracking-wider uppercase mb-3">
          ORDER RECEIVED
        </h2>
        
        <p className="text-gray-500 text-xs sm:text-sm tracking-wide leading-relaxed mb-6 font-sans">
          Shukran, <span className="text-black font-semibold">{placedOrderDetails.customer_name}</span>! Your order has been registered securely on our checkout database. Our courier in <span className="text-black font-semibold">{placedOrderDetails.city}</span> will contact you shortly to confirm and deliver.
        </p>

        {/* Order Details box */}
        <div className="bg-stone-50 border border-stone-200 p-6 rounded-lg text-left divide-y divide-gray-200/60 mb-8 max-w-sm mx-auto font-mono text-[11px] text-gray-600">
          <div className="pb-3 flex justify-between">
            <span className="font-semibold text-gray-500">ORDER NUMBER</span>
            <span className="text-black font-bold uppercase select-all">#{placedOrderDetails.id}</span>
          </div>
          <div className="py-3 flex justify-between">
            <span className="font-semibold text-gray-500">SHIPPING DESTINATION</span>
            <span className="text-black">{placedOrderDetails.city}</span>
          </div>
          <div className="py-3 flex justify-between">
            <span className="font-semibold text-gray-500">PAYMENT TYPE</span>
            <span className="text-emerald-600 font-bold uppercase">Cash on Delivery</span>
          </div>
          <div className="pt-3 flex justify-between text-xs font-semibold text-black">
            <span>TOTAL PRICE</span>
            <span className="font-bold font-mono">{placedOrderDetails.total_price} DH</span>
          </div>
        </div>

        {/* Action Button: Prefilled WhatsApp redirect */}
        <div className="flex flex-col space-y-3 max-w-sm mx-auto">
          <button
            onClick={handleSendWhatsAppConfirmation}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs tracking-[0.2em] py-3.5 uppercase border border-emerald-700/30 flex items-center justify-center space-x-2 transition-transform active:scale-98 cursor-pointer shadow-lg"
          >
            <span>CONFIRM ORDER ON WHATSAPP</span>
          </button>

          <button
            onClick={() => router.push('/shop')}
            className="w-full bg-black hover:bg-stone-800 text-white font-medium text-xs tracking-[0.2em] py-3.5 uppercase transition-colors cursor-pointer"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 font-sans">
      
      {/* Back to catalog button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center space-x-2 text-xs tracking-widest text-gray-400 hover:text-black font-semibold mb-8 uppercase cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>RETURN BACK</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Fill Details Form Block (7 Columns) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-7">
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-medium tracking-wider text-stone-900 uppercase">
              DELIVERY INFORMATION
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Provide accurate shipping addresses. Pay with Cash upon receiving your package.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[11px] font-semibold p-4 tracking-wider uppercase">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4 text-xs font-mono">
            <div className="flex flex-col space-y-2">
              <label className="text-black tracking-widest font-bold uppercase">
                FULL NAME <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Youssef Bennani"
                className="bg-white border border-gray-200 px-4 py-3 font-sans focus:outline-none focus:border-black text-stone-805"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-black tracking-widest font-bold uppercase">
                CONTACT PHONE NUMBER <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +212 612 345678"
                className="bg-white border border-gray-200 px-4 py-3 font-sans focus:outline-none focus:border-black text-stone-805"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-black tracking-widest font-bold uppercase">
                SHIPPING CITY <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-white border border-gray-200 px-4 py-3 font-sans focus:outline-none focus:border-black text-stone-805 text-sm"
              >
                <option value="">-- Select Your City --</option>
                <option value="Tangier">Tangier (Free Next-day Delivery)</option>
                <option value="Casablanca">Casablanca</option>
                <option value="Rabat">Rabat</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Fes">Fes</option>
                <option value="Meknes">Meknes</option>
                <option value="Agadir">Agadir</option>
                <option value="Oujda">Oujda</option>
                <option value="Kenitra">Kenitra</option>
                <option value="Tetouan">Tetouan</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-black tracking-widest font-bold uppercase">
                STREET ADDRESS <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Avenue Pasteur, Immeuble 12, Appt 4"
                className="bg-white border border-gray-200 px-4 py-3 font-sans focus:outline-none focus:border-black text-stone-805"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-black tracking-widest font-bold uppercase">
                SHIPPING NOTES FOR COURIER <span className="text-gray-400">(OPTIONAL)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Ex: Please bring after 16:00, or leave with concierge if unavailable."
                className="bg-white border border-gray-200 p-4 font-sans focus:outline-none focus:border-black text-stone-805"
              ></textarea>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-stone-50 border border-gray-100 p-4 font-sans text-xs text-gray-400 leading-normal">
            <Landmark className="w-5 h-5 text-slate-800 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-900 mb-0.5">Cash On Delivery Guaranteed</p>
              <p>We do not collect credit cards or online payments. Pay Moroccan Dirhams safely to the professional courier in cash only after inspect of your high-fashion clothing.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || cartItems.length === 0}
            className={`w-full bg-black hover:bg-stone-800 text-white font-medium text-xs tracking-[0.25em] py-4 uppercase border border-black flex items-center justify-center space-x-2 transition-transform cursor-pointer ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'active:scale-98'
            }`}
          >
            <span>{isSubmitting ? 'PLACING SECURE ORDER...' : 'PLACE COD ORDER'}</span>
          </button>
        </form>

        <div className="lg:col-span-5 bg-white border border-gray-100 p-6 shadow-xs space-y-6">
          <h2 className="text-xs tracking-[0.25em] font-bold text-black uppercase font-mono pb-4 border-b border-gray-100">
            ORDER SUMMARY
          </h2>

          <div className="divide-y divide-gray-100 max-h-[40vh] overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="py-3.5 flex items-center space-x-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 aspect-[3/4] object-cover object-center bg-stone-100 border shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-grow select-none">
                  <h4 className="text-xs font-semibold text-stone-900 uppercase truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-mono">
                    Qty: {item.quantity} | {item.selectedSize} / {item.selectedColor}
                  </p>
                </div>
                <span className="text-xs font-semibold font-mono text-stone-900 whitespace-nowrap shrink-0">
                  {item.product.price * item.quantity} DH
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3 font-mono text-xs text-gray-600">
            <div className="flex justify-between">
              <span>ITEMS MERCHANDISE</span>
              <span>{subtotal} DH</span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span className="flex items-center space-x-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>SHIPPING NATIONWIDE</span>
              </span>
              <span className="font-semibold uppercase text-[10px]">FREE</span>
            </div>
            
            <div className="border-t border-gray-100 pt-3.5 flex justify-between text-sm font-semibold text-black">
              <span>TOTAL ORDER VALUE</span>
              <span className="font-bold text-base">{subtotal} DH</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
