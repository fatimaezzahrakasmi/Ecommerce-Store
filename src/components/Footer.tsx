"use client";
import Link from 'next/link';
import { Phone, Mail, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 px-4 sm:px-8 py-16 mt-16 select-none border-t border-stone-900 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 font-sans select-none text-pretty">
        
        {/* Logo brand message */}
        <div className="space-y-4">
          <span className="text-white text-lg font-semibold tracking-[0.3em] font-display">B A D R</span>
          <p className="text-stone-500 font-sans leading-relaxed text-[11px]">
            Premium, simple, and mobile-friendly men’s clothing website inspired by clean Spanish fashion stores (minimal, elegant, fast).
          </p>
        </div>

        {/* Quick links */}
        <div className="space-y-4 font-mono text-[10px]">
          <strong className="text-white uppercase tracking-widest block text-[11px]">STUDIO SITES</strong>
          <ul className="space-y-2.5">
            <li><Link href="/" className="hover:text-white uppercase cursor-pointer text-left">HOMEPAGE</Link></li>
            <li><Link href="/shop" className="hover:text-white uppercase cursor-pointer text-left">SHOPPING DIRECTORY</Link></li>
            <li><Link href="/about" className="hover:text-white uppercase cursor-pointer text-left">THE BRAND HERITAGE</Link></li>
            <li><Link href="/contact" className="hover:text-white uppercase cursor-pointer text-left">STUDIO HELPDESK</Link></li>
          </ul>
        </div>

        {/* Category specific directory */}
        <div className="space-y-4 font-mono text-[10px]">
          <strong className="text-white uppercase tracking-widest block text-[11px]">COLLECTIONS</strong>
          <ul className="space-y-2.5">
            <li><Link href="/shop?category=clothes" className="hover:text-white uppercase text-left cursor-pointer">CLOTHING & OUTERS</Link></li>
            <li><Link href="/shop?category=shoes" className="hover:text-white uppercase text-left cursor-pointer">MINIMAL SHOES & LOAFERS</Link></li>
            <li><Link href="/shop?category=caps" className="hover:text-white uppercase text-left cursor-pointer">CASQUETTES & CAPS</Link></li>
            <li><Link href="/shop?category=accessories" className="hover:text-white uppercase text-left cursor-pointer">LEATHER ACCESSOIRES</Link></li>
          </ul>
        </div>

        {/* Service security trust tags */}
        <div className="space-y-4">
          <strong className="text-white font-mono uppercase tracking-widest block text-[11px]">SECURE TANGIER DISPATCH</strong>
          <p className="text-stone-500 leading-normal text-[11px]">
            Shipped nationwide under full Cash on Delivery. Open your packaging, feel the high-density premium cotton, and pay our courier safely on the spot upon delivery receipt.
          </p>
          <div className="flex space-x-4 pt-1">
            <span className="text-stone-500 hover:text-white transition-colors cursor-pointer"><Instagram className="w-4 h-4" /></span>
            <span className="text-stone-500 hover:text-white transition-colors cursor-pointer"><Phone className="w-4 h-4" /></span>
            <span className="text-stone-500 hover:text-white transition-colors cursor-pointer"><Mail className="w-4 h-4" /></span>
          </div>
        </div>

      </div>

      {/* Outer legal line */}
      <div className="max-w-7xl mx-auto border-t border-stone-900 mt-12 pt-8 text-center text-stone-600 font-mono text-[9px] tracking-widest flex flex-col sm:flex-row items-center justify-between space-y-3.5 sm:space-y-0">
        <span>&copy; {new Date().getFullYear()} BADR SPAIN MENSWEAR S.A. ALL RIGHTS SECURED.</span>
        <span>Tangier, Morocco / Madrid, Spain</span>
      </div>
    </footer>
  );
}
