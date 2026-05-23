"use client";
import { ShoppingBag, Menu, X, Landmark, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();

  const navItems = [
    { id: '/', label: 'HOME' },
    { id: '/shop', label: 'SHOP' },
    { id: '/about', label: 'ABOUT' },
    { id: '/contact', label: 'CONTACT' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">


        {/* LOGO - Elegant spanish style spaced lettering */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-semibold tracking-[0.35em] text-black font-display text-left cursor-pointer select-none"
        >
          B A D R
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          {navItems.map((item) => {
            const isActive = pathname === item.id || (item.id === '/shop' && pathname.startsWith('/shop'));
            return (
              <Link
                key={item.id}
                href={item.id}
                className={`text-xs tracking-[0.2em] font-medium transition-colors hover:text-black cursor-pointer ${
                  isActive
                    ? 'text-black border-b border-black pb-1'
                    : 'text-gray-400'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions: Free Delivery Tag, Shopping Bag & Mobile Menu Toggle */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="hidden lg:flex items-center space-x-2 text-[10px] tracking-[0.15em] text-gray-400 font-mono">
            <Landmark className="w-3.5 h-3.5" />
            <span>CASH ON DELIVERY (MOROCCO)</span>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1 text-gray-900 hover:text-black focus:outline-none transition-transform active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-semibold w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
          
          {/* Toggle Mobile Menu (Right Side) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1 text-gray-900 hover:text-black focus:outline-none"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile Sidebar Overlay (Moved outside NAV to fix CSS containing block issue) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer menu (Right aligned) */}
          <div 
            className="absolute top-0 right-0 w-4/5 max-w-sm h-full px-6 py-8 flex flex-col justify-between shadow-2xl bg-white"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div>
              <div className="flex items-center justify-between mb-12">
                <span className="text-lg font-semibold tracking-[0.3em] font-display">B A D R</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-gray-900 hover:text-black focus:outline-none"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col space-y-6">
                {navItems.map((item) => {
                  const isActive = pathname === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.id}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-sm tracking-[0.25em] font-medium text-left transition-colors cursor-pointer py-2 ${
                        isActive
                          ? 'text-black border-l-2 border-black pl-3'
                          : 'text-gray-400 pl-3'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer details in Drawer */}
            <div className="pt-6 border-t border-gray-100 flex flex-col space-y-3.5 font-mono">
              <div className="flex items-center space-x-2 text-[10px] tracking-[0.1em] text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tangier, Morocco Base</span>
              </div>
              <p className="text-[9px] text-gray-400 leading-relaxed">
                Premium Spanish minimalism, crafted for Moroccan streetwear culture. Cash on Delivery nationwide.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
