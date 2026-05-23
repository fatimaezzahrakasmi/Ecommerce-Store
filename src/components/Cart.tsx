import { CartItem } from '../types';
import { ShoppingBag, X, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
}

export default function Cart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onProceedToCheckout }: CartProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between h-full animate-slide-in-right">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="text-sm tracking-[0.2em] font-medium text-black uppercase">SHOPPING BAG</h2>
              <span className="font-mono text-xs text-gray-400">({cartItems.length})</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 px-2.5 -mr-2 text-gray-400 hover:text-black hover:bg-gray-100 uppercase text-[10px] tracking-widest font-mono cursor-pointer transition-colors"
              id="cart-close-btn"
            >
              CLOSE
            </button>
          </div>

          {/* Items List */}
          <div className="flex-grow overflow-y-auto px-6 py-4 divide-y divide-gray-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <ShoppingBag className="w-10 h-10 text-gray-300 stroke-[1.2]" />
                <p className="text-xs tracking-wider text-gray-400 font-mono">YOUR SHOPPING BAG IS EMPTY</p>
                <button
                  onClick={onClose}
                  className="text-xs bg-black text-white hover:bg-stone-800 px-6 py-2.5 tracking-[0.2em] font-medium uppercase transition-all cursor-pointer"
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="py-4.5 flex items-start space-x-4">
                  {/* Thumbnail */}
                  <div className="w-20 aspect-[3/4] bg-neutral-100 border border-neutral-100 overflow-hidden shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details block */}
                  <div className="flex-grow flex flex-col justify-between h-auto pr-1">
                    <div>
                      <div className="flex justify-between items-start space-x-2">
                        <h4 className="text-xs tracking-wider text-black font-semibold uppercase truncate max-w-[180px]">
                          {item.product.name}
                        </h4>
                        <span className="text-xs font-semibold font-mono text-black whitespace-nowrap">
                          {item.product.price * item.quantity} DH
                        </span>
                      </div>
                      
                      {/* Size / Color description tags */}
                      <p className="text-[10px] tracking-wider text-gray-400 font-mono uppercase mt-1">
                        SIZE: {item.selectedSize} | COLOR: {item.selectedColor}
                      </p>
                    </div>

                    {/* Quantity Selector & Trash */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2.5 py-1 text-gray-400 hover:text-black font-mono font-bold text-xs cursor-pointer select-none"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-mono text-xs font-semibold text-black select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.min(item.product.stock, item.quantity + 1))}
                          className="px-2.5 py-1 text-gray-400 hover:text-black font-mono font-bold text-xs cursor-pointer select-none"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-300 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout pricing panel footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-stone-50/60 flex flex-col space-y-4">
              <div className="flex items-center justify-between font-medium">
                <span className="text-xs tracking-widest text-gray-500 uppercase">SUBTOTAL</span>
                <span className="text-base font-semibold font-mono text-black">{subtotal} DH</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 border-b border-gray-200/60 pb-3 font-mono">
                <span>SHIPPING (MOROCCO)</span>
                <span className="text-emerald-600 font-semibold uppercase">FREE SHIPPING</span>
              </div>

              {/* Secure order statement */}
              <div className="flex items-start space-x-2 pb-1 pt-1 font-mono text-[9px] text-emerald-600">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                <span className="leading-tight">
                  ZERO PAYMENT ONLINE REQUIRED. Securely pay on delivery (COD) in Cash after inspection!
                </span>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full bg-black hover:bg-stone-800 text-white font-medium text-xs tracking-[0.25em] py-4 uppercase border border-black flex items-center justify-center space-x-2 transition-transform cursor-pointer"
                id="cart-checkout-btn"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
