import { Product, CartItem } from '../types';
import { useState } from 'react';
import { ShoppingBag, ChevronLeft, ArrowRight, MessageSquareCode, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  onBackToCatalog: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onWhatsAppInquire: (product: Product, size: string, color: string) => void;
}

export default function ProductDetails({ product, onBackToCatalog, onAddToCart, onWhatsAppInquire }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [activeSize, setActiveSize] = useState(product.sizes[0] || '');
  const [activeColor, setActiveColor] = useState(product.colors[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');

  const handleDecreaseQty = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleIncreaseQty = () => {
    setQuantity((q) => Math.min(product.stock, q + 1));
  };

  const handleAddToBag = () => {
    if (product.stock === 0) return;
    onAddToCart(product, activeSize, activeColor, quantity);
    setSuccessMsg('ADDED TO BAG SUCCESSFULLY');
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Back button */}
      <button
        onClick={onBackToCatalog}
        className="inline-flex items-center space-x-2 text-xs tracking-widest text-gray-400 hover:text-black font-semibold mb-8 uppercase cursor-pointer"
        id="btn-back-to-catalog"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>BACK TO COLLECTIONS</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* LEFT COLUMN: Gallery View (5 columns) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Large Image Frame */}
          <div className="aspect-[3/4] bg-white border border-gray-100 overflow-hidden relative group">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
              referrerPolicy="no-referrer"
            />
            
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-black text-white font-mono text-[10px] tracking-[0.3em] px-4 py-2 uppercase">
                  OUT OF STOCK
                </span>
              </div>
            )}
          </div>

          {/* Gallery Thumbnails List */}
          {product.images.length > 1 && (
            <div className="flex space-x-3.5 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-24 aspect-[3/4] bg-white border overflow-hidden cursor-pointer transition-all ${
                    selectedImage === img ? 'border-black ring-1 ring-black' : 'border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} alternate view ${idx + 1}`}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Details (5 columns) */}
        <div className="lg:col-span-5 flex flex-col space-y-7">
          
          {/* Product Header */}
          <div className="border-b border-gray-100 pb-5">
            <span className="text-[10px] tracking-[0.3em] text-gray-400 font-mono uppercase block mb-1">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-medium text-stone-950 uppercase tracking-widest leading-snug">
              {product.name}
            </h1>
            <div className="mt-3.5 flex items-baseline justify-between select-none">
              <span className="text-xl sm:text-2xl font-mono font-semibold text-black">
                {product.price} DH
              </span>
              <span className="text-[10px] tracking-widest text-[#111] font-mono bg-stone-100 px-2 py-1 select-all hover:bg-stone-200">
                REF: BD-{product.id.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Description Block */}
          <div className="space-y-3.5">
            <h4 className="text-[10px] tracking-[0.2em] font-bold text-black uppercase font-mono">
              DESCRIPTION
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed tracking-wide font-sans text-pretty">
              {product.description}
            </p>
          </div>

          {/* Sizes Options Selection */}
          {product.sizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="tracking-[0.2em] font-bold text-black uppercase">AVAILABLE SIZES</span>
                <span className="text-gray-400">SELECT TO ADD</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setActiveSize(size)}
                    className={`min-w-12 h-11 px-3 text-xs font-mono border flex items-center justify-center cursor-pointer transition-all ${
                      activeSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white hover:bg-stone-55 hover:text-black border-gray-200 text-stone-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors Selection */}
          {product.colors.length > 0 && product.colors[0] !== 'Default' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="tracking-[0.2em] font-bold text-black uppercase">COLORWAY</span>
                <span className="text-gray-400">{activeColor}</span>
              </div>
              <div className="flex flex-wrap gap-3.5">
                {product.colors.map((color) => {
                  // Some smart coloring styling fallback or simple badge tags
                  const isBlack = color.toLowerCase().includes('black') || color.toLowerCase().includes('ink');
                  const isWhite = color.toLowerCase().includes('white') || color.toLowerCase().includes('ecru');
                  const isBeige = color.toLowerCase().includes('beige') || color.toLowerCase().includes('sand') || color.toLowerCase().includes('khaki');
                  const isBrown = color.toLowerCase().includes('chocolate') || color.toLowerCase().includes('brown');
                  const isSage = color.toLowerCase().includes('sage') || color.toLowerCase().includes('green') || color.toLowerCase().includes('olive');
                  
                  let dotBg = 'bg-stone-300';
                  if (isBlack) dotBg = 'bg-black';
                  if (isWhite) dotBg = 'bg-white border border-gray-300';
                  if (isBeige) dotBg = 'bg-[#E1D1B7]';
                  if (isBrown) dotBg = 'bg-[#4B3B2B]';
                  if (isSage) dotBg = 'bg-[#708238]';

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setActiveColor(color)}
                      className={`flex items-center space-x-2.5 px-3 py-1.5 border capitalize text-[11px] font-display transition-all cursor-pointer ${
                        activeColor === color
                          ? 'border-black text-black bg-stone-50'
                          : 'border-gray-200 text-gray-500 hover:border-gray-400'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${dotBg}`}></span>
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock state details */}
          <div className="py-2 flex items-center justify-between border-t border-b border-gray-100 select-none">
            <span className="text-[10px] tracking-[0.2em] font-medium font-mono text-gray-400">STOCK STATUS</span>
            {product.stock === 0 ? (
              <span className="text-xs font-bold text-red-500 font-display">SOLD OUT / OUT OF STOCK</span>
            ) : product.stock <= 5 ? (
              <span className="text-xs font-bold text-amber-600 font-display uppercase font-mono bg-amber-50 px-2 py-1">ONLY {product.stock} PIECES LEFT</span>
            ) : (
              <span className="text-xs font-medium text-emerald-600 font-display uppercase font-mono bg-emerald-50 px-2.5 py-1">IN STOCK ({product.stock} units available)</span>
            )}
          </div>

          {/* Interactive Quantity Adjuster & Add actions */}
          {product.stock > 0 && (
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {/* Quantity adjustments */}
                <div className="flex border border-gray-200 w-fit">
                  <button
                    onClick={handleDecreaseQty}
                    className="px-3.5 py-2.5 text-gray-500 hover:text-black font-semibold cursor-pointer select-none"
                    type="button"
                  >
                    -
                  </button>
                  <span className="px-5 py-2.5 text-xs font-mono font-medium text-black flex items-center justify-center select-all">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncreaseQty}
                    className="px-3.5 py-2.5 text-gray-500 hover:text-black font-semibold cursor-pointer select-none"
                    type="button"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={handleAddToBag}
                  className="flex-grow w-full sm:w-auto bg-black hover:bg-stone-800 text-white font-medium text-xs tracking-[0.2em] py-3.5 px-6 uppercase border border-black transition-all flex items-center justify-center space-x-3 cursor-pointer"
                  id="btn-add-to-bag"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                  <span>{successMsg || 'ADD TO SHOPPING BAG'}</span>
                </button>
              </div>

              {/* WHATSAPP SPECIFIC DIRECT ACTIONS (Mandated by PRD) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3.5">
                <button
                  onClick={() => onWhatsAppInquire(product, activeSize, activeColor)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] tracking-[0.18em] py-3 px-4 border border-emerald-700/30 flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                  id="btn-direct-order-whatsapp"
                >
                  <MessageSquareCode className="w-4 h-4" />
                  <span>ORDER VIA WHATSAPP</span>
                </button>

                <button
                  onClick={() => onWhatsAppInquire(product, activeSize, activeColor)}
                  className="bg-white hover:bg-stone-50 text-stone-800 font-medium text-[11px] tracking-[0.18em] py-3 px-4 border border-stone-300 flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                  id="btn-ask-about-product"
                >
                  <span>ASK ABOUT THIS PRODUCT</span>
                </button>
              </div>
            </div>
          )}

          {/* Value Badges Accordion style/Footer */}
          <div className="pt-4 space-y-3 font-mono text-[10px] text-gray-400">
            <div className="flex items-center space-x-3.5">
              <Truck className="w-4.5 h-4.5 text-slate-800 stroke-[1.5]" />
              <span className="tracking-wide">FAST SHIPPING NATIONWIDE & FREE TANGIER DELIVERY</span>
            </div>
            <div className="flex items-center space-x-3.5">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 stroke-[1.5]" />
              <span className="tracking-wide">CASH ON DELIVERY — INSPECT BEFORE YOU PAY</span>
            </div>
            <div className="flex items-center space-x-3.5">
              <RefreshCw className="w-4.5 h-4.5 text-slate-800 stroke-[1.5]" />
              <span className="tracking-wide">EASY SIZING EXCHANGES WITHIN 7 DAYS</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
