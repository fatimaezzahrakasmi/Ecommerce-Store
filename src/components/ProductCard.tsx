"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '../types';
import { ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCartDirect: (product: Product, size: string, color: string, quantity?: number) => void;
  onWhatsAppInquireDirect: (product: Product, size?: string, color?: string) => void;
}

export default function ProductCard({ product, onAddToCartDirect, onWhatsAppInquireDirect }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [sizeSelectorOpen, setSizeSelectorOpen] = useState(false);

  const displayImage = hovered && product.images.length > 1 ? product.images[1] : product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;

    if (product.sizes.length === 1 || product.sizes[0] === 'One Size') {
      onAddToCartDirect(product, product.sizes[0], product.colors[0] || 'Default');
    } else {
      setSizeSelectorOpen(!sizeSelectorOpen);
    }
  };

  const handleSelectSizeAndAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCartDirect(product, size, product.colors[0] || 'Default');
    setSizeSelectorOpen(false);
  };

  return (
    <div
      className="group relative flex flex-col bg-white border border-gray-100/60 overflow-hidden transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setSizeSelectorOpen(false);
      }}
    >
      <Link href={`/product/${product.id}`} className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden block">
        <img
          src={displayImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        <div className="absolute top-3.5 left-3.5 flex flex-col space-y-1 z-10">
          {product.stock === 0 ? (
            <span className="bg-black text-white font-mono text-[8px] tracking-[0.2em] px-2 py-1 uppercase">SOLD OUT</span>
          ) : product.newArrival ? (
            <span className="bg-stone-100 text-stone-900 border border-stone-300 font-mono text-[8px] tracking-[0.2em] px-2 py-1 uppercase">NEW IN</span>
          ) : null}
          {product.featured && product.stock > 0 && (
            <span className="bg-[#111] text-white font-mono text-[8px] tracking-[0.2em] px-2 py-1 uppercase">ESSENTIAL</span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
          <div className="text-white hover:text-gray-200 p-1.5 bg-black/40 backdrop-blur-xs rounded-full transition-colors">
            <Eye className="w-4 h-4" />
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWhatsAppInquireDirect(product);
            }}
            className="text-emerald-400 hover:text-emerald-300 p-1.5 bg-black/40 backdrop-blur-xs rounded-full transition-colors cursor-pointer text-xs"
          >
            WhatsApp
          </button>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow bg-white">
        <div className="flex items-start justify-between space-x-2">
          <Link href={`/product/${product.id}`} className="text-xs tracking-wider text-gray-800 hover:text-black font-medium uppercase font-display cursor-pointer truncate flex-grow">
            {product.name}
          </Link>
          <span className="text-xs font-semibold font-mono text-stone-900 shrink-0">
            {product.price} DH
          </span>
        </div>

        <p className="text-[10px] tracking-widest text-gray-400 font-mono uppercase mt-1">
          {product.category}
        </p>

        <div className="mt-2.5 flex items-center space-x-1.5 text-[9px] font-mono text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-none">
          <span>SIZES:</span>
          {product.sizes.map((s) => (
            <span key={s} className={`px-1 border border-transparent rounded-xs ${product.stock === 0 ? 'line-through text-gray-300' : 'text-gray-600'}`}>
              {s}
            </span>
          ))}
        </div>

        <div className="mt-3.5 flex items-center justify-between text-[10px] font-mono text-gray-400 pt-3 border-t border-gray-100">
          <span>Stock:</span>
          {product.stock === 0 ? (
            <span className="text-red-500 font-semibold uppercase font-display">Out of Stock</span>
          ) : product.stock <= 5 ? (
            <span className="text-amber-600 font-semibold uppercase">{product.stock} LEFT</span>
          ) : (
            <span className="text-emerald-600 font-medium">{product.stock} AVAILABLE</span>
          )}
        </div>

        <div className="mt-4 relative">
          {sizeSelectorOpen && product.stock > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-stone-900 text-white p-2.5 border border-stone-800 flex flex-col space-y-2 z-20 shadow-xl transition-all duration-300 animate-slide-up">
              <span className="text-[9px] tracking-widest text-center font-mono text-stone-400">SELECT SIZE:</span>
              <div className="grid grid-cols-4 gap-1.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => handleSelectSizeAndAdd(e, size)}
                    className="py-1 text-[11px] font-mono bg-stone-800 hover:bg-white hover:text-black text-center border border-stone-700 hover:border-white transition-colors cursor-pointer rounded-xs"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`w-full py-2.5 text-[10px] sm:text-xs tracking-[0.2em] font-medium uppercase border flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-black text-white hover:bg-stone-800 border-black transform active:scale-98'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
            <span>{sizeSelectorOpen ? 'CANCEL' : 'QUICK ADD'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
