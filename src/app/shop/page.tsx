"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, Category } from '../../types';
import ProductCard from '../../components/ProductCard';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase';
import { WHATSAPP_PHONE } from '../../config/constants';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(initialCategory);
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    setSelectedCategoryFilter(searchParams.get('category') || 'all');
  }, [searchParams]);

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

  const filteredProducts = selectedCategoryFilter === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategoryFilter);

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-4">
        <span className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-black animate-spin"></span>
        <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">LOADING CATALOG...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Catalog Title */}
      <div className="border-b border-gray-100 pb-6 mb-8 select-none">
        <h1 className="text-2xl font-display font-medium tracking-widest text-black uppercase">
          THE ARCHITECTURE COLLECTION
        </h1>
        <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-0.5">
          Minimal contours, tailored fits, custom washed cottons
        </p>
      </div>

      {/* Categories filter sidebar/row selector */}
      <div className="flex flex-wrap items-center gap-2.5 mb-8 select-none">
        <button
          onClick={() => setSelectedCategoryFilter('all')}
          className={`px-5 py-2 text-xs font-mono font-medium border uppercase tracking-wider transition-colors cursor-pointer ${
            selectedCategoryFilter === 'all'
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-500 border-gray-200 hover:border-black'
          }`}
        >
          ALL CLOTHING
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategoryFilter(c.id)}
            className={`px-5 py-2 text-xs font-mono font-medium border uppercase tracking-wider transition-colors cursor-pointer ${
              selectedCategoryFilter === c.id
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-500 border-gray-200 hover:border-black'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Sub catalog summary information */}
      <p className="text-[10px] text-gray-400 font-mono tracking-wider mb-6 select-none leading-relaxed">
        DISPLAYING {filteredProducts.length} ARTICLES FROM {selectedCategoryFilter.toUpperCase()} COLLECTION
      </p>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 border border-dashed text-center font-mono text-xs text-gray-400 rounded-xs">
          NO ARTICLES RECORDED IN THIS CATEGORY SECTION YET
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCartDirect={addToCart}
              onWhatsAppInquireDirect={triggerWhatsAppInquiry}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div>Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
