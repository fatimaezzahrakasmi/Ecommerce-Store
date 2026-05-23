"use client";
import { MapPin, Phone, Mail, Instagram, ArrowRight } from 'lucide-react';

export default function Contact() {
  const handleFollowInstagram = () => {
    window.open('https://instagram.com', '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 font-sans">
      <div className="text-center mb-16 select-none animate-fade-in">
        <span className="text-[10px] font-mono tracking-[0.4em] text-gray-400 uppercase">
          G E T / I N / T O U C H
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-medium text-black uppercase tracking-[0.2em] mt-3.5">
          C O N T A C T / B A D R
        </h1>
        <div className="h-[1px] w-20 bg-stone-300 mx-auto mt-6"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-xs tracking-widest font-bold font-mono text-black uppercase pb-4 border-b border-gray-100">
            FLAGSHIP STUDIO HEADQUARTERS
          </h2>

          <div className="space-y-5.5 text-xs text-gray-500 font-sans tracking-wide">
            <div className="flex items-start space-x-4">
              <div className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center text-black shrink-0">
                <MapPin className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div className="space-y-0.5">
                <p className="font-mono font-bold text-black uppercase tracking-wider text-[10px]">TANGIER OFFICE STUDIO</p>
                <p className="text-stone-900 leading-normal">
                  Boulevard Pasteur, Immeuble Alhambra<br/>
                  Tangier, 90000 Morocco
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center text-black shrink-0">
                <Phone className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div className="space-y-0.5">
                <p className="font-mono font-bold text-black uppercase tracking-wider text-[10px]">CUSTOMER PHONE HOTLINE</p>
                <p className="font-semibold text-stone-900">+212 600-000000</p>
                <p className="text-[11px] text-gray-400 leading-relaxed">Available Mon-Sat (10:00 - 18:00) for sizes or delivery queries.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center text-black shrink-0">
                <Mail className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div className="space-y-0.5">
                <p className="font-mono font-bold text-black uppercase tracking-wider text-[10px]">EMAIL COLLECTIONS DESK</p>
                <p className="font-semibold text-stone-900 select-all">support@badr-fashion.com</p>
                <p className="text-[11px] text-gray-400 leading-relaxed">Response within 24 hours.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center text-black shrink-0">
                <Instagram className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <p className="font-mono font-bold text-black uppercase tracking-wider text-[10px]">INSTAGRAM & SOCIALS</p>
                <button
                  onClick={handleFollowInstagram}
                  className="text-stone-900 hover:text-black hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <span>@badr.menswear</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-gray-100 p-6 sm:p-8 shadow-xs rounded-md">
          <h2 className="text-xs tracking-widest font-bold font-mono text-black uppercase pb-4 border-b border-gray-100 mb-6">
            SEND MESSAGE ENQUIRY
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); alert('Message sent securely! We will answer shortly via WhatsApp or Email.'); }} className="space-y-5 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-black font-bold uppercase tracking-widest">NAME</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Amine"
                  className="bg-white border border-gray-200 p-3 font-sans text-stone-900 focus:outline-none focus:border-black"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-black font-bold uppercase tracking-widest">EMAIL / PHONE</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: +2126..."
                  className="bg-white border border-gray-200 p-3 font-sans text-stone-900 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-black font-bold uppercase tracking-widest">MESSAGE SUBJECT</label>
              <input
                type="text"
                required
                placeholder="Ex: Wholesale, Sizing or Bulk shipping"
                className="bg-white border border-gray-200 p-3 font-sans text-stone-900 focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-black font-bold uppercase tracking-widest">DETAILED MESSAGE</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your request in detail..."
                className="bg-white border border-gray-200 p-3 font-sans text-stone-905 focus:outline-none focus:border-black"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-stone-850 text-white py-3.5 tracking-[0.25em] border border-black font-bold text-[10px] uppercase cursor-pointer"
            >
              SEND MESSAGE
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
