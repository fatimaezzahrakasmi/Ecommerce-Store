"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, Category } from '../types';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { WHATSAPP_PHONE } from '../config/constants';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      const [{ data: pData }, { data: cData }] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*')
      ]);

      if (pData) setProducts(pData as Product[]);
      if (cData) setCategories(cData as Category[]);
      
      setIsLoading(false);
    }
    loadData();
  }, []);

  const triggerWhatsAppInquiry = (product: Product, size: string = 'M', color: string = 'Default') => {
    const message = `Salam Badr! I am interested in this item:
- Name: ${product.name}
- Size: ${size}
- Color: ${color}
- Price: ${product.price} DH

Please let me know if it's available for Tangier delivery. Shukran!`;

    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, '_blank', 'noreferrer');
  };

  const featuredProducts = products.filter(p => p.featured);
  const newArrivals = products.filter(p => p.newArrival);

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-4">
        <span className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-black animate-spin"></span>
        <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">LOADING COLLECTIONS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Hero section */}
      <Hero />

      {/* Categories Browse section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 select-none">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-gray-400 block uppercase">CATEGORIES</span>
            <h2 className="text-sm font-display font-medium tracking-widest text-black uppercase mt-1">BROWSE DIRECTORIES</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              href={`/shop?category=${cat.id}`}
              key={cat.id}
              className="group relative aspect-[3/4] bg-stone-100 overflow-hidden border border-gray-100 cursor-pointer rounded-xs block"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-104 brightness-95 group-hover:brightness-85"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col items-center text-center">
                <span className="text-white text-xs sm:text-sm font-display font-medium tracking-widest uppercase mb-1">
                  {cat.name}
                </span>
                <span className="text-[9px] text-white/60 font-mono tracking-[0.2em] uppercase flex items-center space-x-1 group-hover:text-white transition-colors">
                  <span>EXPLORE</span>
                  <ChevronRight className="w-3 h-3 translate-y-[-0.5px]" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-gray-400 block uppercase font-bold">ESSENTIALS</span>
            <h2 className="text-sm font-display font-medium tracking-widest text-black uppercase mt-1">FEATURED PIECES</h2>
          </div>
          <Link
            href="/shop"
            className="text-stone-400 hover:text-black font-semibold font-mono text-[10px] tracking-widest uppercase transition-colors"
          >
            VIEW ALL
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCartDirect={addToCart}
              onWhatsAppInquireDirect={triggerWhatsAppInquiry}
            />
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-gray-400 block uppercase font-bold">FRESH IN</span>
            <h2 className="text-sm font-display font-medium tracking-widest text-black uppercase mt-1">NEW ARRIVALS</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCartDirect={addToCart}
              onWhatsAppInquireDirect={triggerWhatsAppInquiry}
            />
          ))}
        </div>
      </section>

      {/* Beautiful Moroccan Specific WhatsApp contact banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 select-none">
        <div className="bg-stone-900 text-white p-8 sm:p-12 text-center space-y-6 relative overflow-hidden rounded-md border border-stone-850">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          <p className="text-[10px] font-mono tracking-[0.35em] text-emerald-400 uppercase font-bold">
            W H A T S A P P / S U P P O R T
          </p>

          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-widest text-white uppercase leading-snug">
            FAST TRACK SIZING & ADVISORY
          </h2>

          <p className="text-gray-300 text-xs tracking-wider max-w-lg mx-auto font-sans leading-relaxed">
            Slightly unsure about your vest or shoe sizes? Text with our Tangier support studio directly. Send us a photo of the clothing item you want to order and get real assistance.
          </p>

          <button
            onClick={() => products.length && triggerWhatsAppInquiry(products[0])}
            className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-700/30 text-xs font-bold tracking-[0.2em] px-8 py-3.5 uppercase inline-flex items-center space-x-2.5 cursor-pointer transform hover:scale-[1.02] active:scale-95 transition-transform z-10 relative"
          >
            <Phone className="w-4 h-4" />
            <span>TALK TO DESIGN HUB</span>
          </button>
        </div>
      </section>
    </div>
  );
}
