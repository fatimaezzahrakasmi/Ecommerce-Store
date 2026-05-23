"use client";
import { useEffect, useState, use } from 'react';
import { Product } from '../../../types';
import ProductDetails from '../../../components/ProductDetails';
import { useCart } from '../../../context/CartContext';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import { WHATSAPP_PHONE } from '../../../config/constants';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      const { data } = await supabase.from('products').select('*').eq('id', productId).single();
      if (data) setProduct(data as Product);
      setIsLoading(false);
    }
    loadProduct();
  }, [productId]);

  const triggerWhatsAppInquiry = (prod: Product, size: string = 'M', color: string = 'Default') => {
    const message = `Salam Badr! I am interested in this item:
- Name: ${prod.name}
- Size: ${size}
- Color: ${color}
- Price: ${prod.price} DH

Please let me know if it's available for Tangier delivery. Shukran!`;

    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, '_blank', 'noreferrer');
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-4">
        <span className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-black animate-spin"></span>
        <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">LOADING PRODUCT...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-32 text-center text-xs font-mono text-gray-400">
        PRODUCT NOT FOUND INDEED
      </div>
    );
  }

  return (
    <ProductDetails
      product={product}
      onBackToCatalog={() => router.push('/shop')}
      onAddToCart={addToCart}
      onWhatsAppInquire={triggerWhatsAppInquiry}
    />
  );
}
