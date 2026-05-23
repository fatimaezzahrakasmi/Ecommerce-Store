"use client";
import { MessageCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { WHATSAPP_PHONE } from '../config/constants';

export default function WhatsAppFloating() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip after 5 seconds to prompt user interaction gently
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppRedirect = () => {
    // Standard phone number format for Morocco support
    const message = encodeURIComponent("Salam! I have some questions about BADR's collections.");
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank', 'noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Gentle responsive tooltip */}
      {showTooltip && (
        <div className="bg-white text-stone-900 border border-stone-200 py-3.5 px-4 rounded-xl shadow-xl flex items-center justify-between mb-3 text-xs w-64 animate-slide-in relative">
          <div className="flex-grow pr-2">
            <p className="font-semibold text-emerald-600 mb-0.5 font-display flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 inline-block animate-ping"></span>
              WhatsApp Support
            </p>
            <p className="text-[11px] text-stone-500 leading-normal font-sans">
              Salam! Questions about sizes or Tangier delivery? Ask us anytime.
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-gray-300 hover:text-black absolute top-2 right-2 p-0.5"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Pulsing Emerald Floating Button */}
      <button
        onClick={handleWhatsAppRedirect}
        className="bg-emerald-600 text-white rounded-full p-4 hover:bg-emerald-500 shadow-2xl transition-all duration-300 flex items-center justify-center relative hover:scale-[1.08] active:scale-90 cursor-pointer border border-emerald-700/40"
        aria-label="Contact us on WhatsApp"
        id="btn-whatsapp-floating"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25"></span>
        <MessageCircle className="w-7 h-7 relative z-10 fill-white text-emerald-600" />
      </button>
    </div>
  );
}
