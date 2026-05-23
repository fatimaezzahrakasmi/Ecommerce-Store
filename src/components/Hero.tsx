import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] bg-stone-900 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=1500"
          alt="Spanish minimalism aesthetic men fashion"
          className="w-full h-full object-cover object-center opacity-85 brightness-75 scale-105 transition-transform duration-[10000ms] ease-out hover:scale-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-neutral-900/40"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl flex flex-col items-center">
        <p className="text-white/80 font-mono text-[10px] sm:text-xs tracking-[0.4em] mb-4 sm:mb-6 uppercase animate-fade-in">
          S P R I N G / S U M M E R ' 2 6
        </p>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-medium text-white tracking-[0.2em] leading-tight mb-6 sm:mb-8 text-shadow-sm uppercase">
          B A D R<br/>
          <span className="font-light tracking-[0.10em] text-white/90">E L E G A N C E</span>
        </h1>

        <div className="h-[1px] w-20 bg-white/40 mb-6 sm:mb-8"></div>

        <p className="text-gray-200 text-xs sm:text-sm font-sans tracking-[0.1em] max-w-md mx-auto leading-relaxed mb-8 sm:mb-10 text-pretty">
          Inspired by Spanish simplicity. Fine cuts, muted warm tones, and high-density cotton. Tailored for Morocco's next wave.
        </p>

        <Link
          href="/shop"
          className="bg-white hover:bg-black hover:text-white text-black text-xs font-semibold tracking-[0.25em] px-8 py-4 uppercase border border-white transition-all duration-300 hover:border-black transform hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg hover:shadow-xl inline-block"
        >
          EXPLORE CATALOG
        </Link>
      </div>

      <div className="absolute bottom-8 left-8 hidden lg:block font-mono text-[9px] tracking-[0.2em] text-white/60">
        CASUAL / STREETWEAR / TAILORED
      </div>
      <div className="absolute bottom-8 right-8 hidden lg:block font-mono text-[9px] tracking-[0.2em] text-white/60">
        BASED IN TANGIER, MA
      </div>
    </div>
  );
}
