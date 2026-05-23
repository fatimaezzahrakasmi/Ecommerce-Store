"use client";
import { Compass, HeartHandshake } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 text-center select-none font-sans">
      <span className="text-[10px] font-mono tracking-[0.4em] text-gray-400 uppercase">
        O U R / S T O R Y
      </span>
      
      <h1 className="text-3xl sm:text-4xl font-display font-medium text-black uppercase tracking-[0.2em] mt-3.5 mb-8">
        B A D R / H E R I T A G E
      </h1>

      <div className="h-[1px] w-20 bg-stone-300 mx-auto mb-10"></div>

      <div className="aspect-[21/9] w-full bg-stone-100 overflow-hidden border mb-12 relative group rounded-xs border-stone-200">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200"
          alt="Badr warehouse production"
          className="w-full h-full object-cover object-center brightness-90 transition-transform duration-[8000ms] group-hover:scale-103"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-neutral-900/10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left text-xs text-gray-500 leading-relaxed tracking-wide">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-black mb-1">
            <Compass className="w-5 h-5 text-stone-700 stroke-[1.5]" />
            <h3 className="font-mono font-bold uppercase tracking-widest text-[11px]">THE ESPAÑA COMPASS</h3>
          </div>
          <p className="text-pretty">
            Established in 2026, BADR was born from an obsession with the seamless cutting styles found in Spanish coastal cities like Barcelona and San Sebastián. We believed that menswear shouldn't be complex. By stripping away loud branding, excessive stitching, and visual clutter, we create an elegant drape that feels raw yet professional.
          </p>
          <p className="text-pretty">
            Every garment begins with heavily structured raw cotton, sourced consciously. We prioritize weights like 240GSM to 400GSM in hoodies and t-shirts to ensure they maintain their boxy modern silhouettes over years of wear.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-black mb-1">
            <HeartHandshake className="w-5 h-5 text-stone-700 stroke-[1.5]" />
            <h3 className="font-mono font-bold uppercase tracking-widest text-[11px]">TANGIER GATEWAY</h3>
          </div>
          <p className="text-pretty">
            As we expand, our design hub resides directly in Tangier, Morocco. Serving as the strategic bridge between Europe and North Africa, Tangier represents the visual flow of our garments. We combine European tailoring proportions with the needs of the Moroccan street generation.
          </p>
          <p className="text-pretty">
            To foster absolute trust in Morocco, we implement a full Cash on Delivery shipment pipeline. Review your fabrics, feel the cotton densities on your shoulders, test the shoe fittings, and pay only once fully satisfied!
          </p>
        </div>
      </div>
    </div>
  );
}
