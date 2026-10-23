import React from 'react';

interface SplashLogo3DProps {
  iconUrl?: string;
}

export const SplashLogo3D: React.FC<SplashLogo3DProps> = ({
  iconUrl = '/assets/brick_breaker_icon.png',
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-4xl mx-auto px-4 pointer-events-none">
      {/* Dynamic Background Halo & Radial Flare */}
      <div 
        className="absolute -top-16 w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl opacity-60 pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.5) 0%, rgba(245,158,11,0.25) 50%, transparent 75%)',
        }}
      />

      {/* Floating Decorative Neon Bricks around the logo */}
      {/* Top Left Brick (Gold) */}
      <div className="absolute -top-10 -left-6 md:-left-16 hidden sm:flex items-center justify-center w-14 h-7 md:w-20 md:h-9 rounded-md bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 border border-amber-200/80 shadow-[0_0_20px_rgba(245,158,11,0.8)] rotate-[-14deg] animate-float">
        <div className="w-full h-full bg-white/20 rounded-sm opacity-50" />
      </div>

      {/* Top Right Brick (Cyan Neon) */}
      <div 
        className="absolute -top-6 -right-6 md:-right-14 hidden sm:flex items-center justify-center w-12 h-6 md:w-16 md:h-8 rounded-md bg-gradient-to-r from-cyan-500 via-cyan-400 to-sky-300 border border-cyan-200/90 shadow-[0_0_25px_rgba(6,182,212,0.9)] rotate-[18deg] animate-float"
        style={{ animationDelay: '1.2s' }}
      >
        <div className="w-full h-full bg-white/25 rounded-sm" />
      </div>

      {/* Mid Left Brick (Magenta/Ruby) */}
      <div 
        className="absolute top-24 -left-10 md:-left-20 hidden md:flex items-center justify-center w-14 h-6 rounded-md bg-gradient-to-r from-pink-600 via-rose-500 to-pink-400 border border-pink-200/60 shadow-[0_0_20px_rgba(244,63,94,0.7)] rotate-[8deg] animate-float"
        style={{ animationDelay: '2.1s' }}
      />

      {/* Mid Right Brick (Electric Emerald) */}
      <div 
        className="absolute top-28 -right-8 md:-right-16 hidden md:flex items-center justify-center w-12 h-6 rounded-md bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-300 border border-emerald-200/60 shadow-[0_0_20px_rgba(16,185,129,0.7)] rotate-[-12deg] animate-float"
        style={{ animationDelay: '0.7s' }}
      />

      {/* Hero Game Icon Badge */}
      <div className="relative mb-2 group">
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-cyan-400 to-orange-500 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500" />
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl p-1 bg-slate-900/90 border border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center justify-center overflow-hidden">
          <img 
            src={iconUrl} 
            alt="Brick Breaker Icon" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            onError={(e) => {
              // Fallback if local asset or external fails
              const target = e.currentTarget;
              if (target.src !== 'https://i.postimg.cc/YCRD844q/IMG-20261022-WA0009-3e96.png') {
                target.src = 'https://i.postimg.cc/YCRD844q/IMG-20261022-WA0009-3e96.png';
              }
            }}
          />
          {/* Glossy reflection on icon */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 rounded-xl pointer-events-none" />
        </div>
      </div>

      {/* 3D LOGO CONTAINER WITH MULTI-LAYER BEVEL & PERSPECTIVE */}
      <div className="relative flex flex-col items-center justify-center text-center py-2 animate-neon-pulse">
        
        {/* WORD 1: BRICK */}
        <div className="relative">
          {/* Deep 3D Shadow layer */}
          <h1 
            aria-hidden="true"
            className="font-arcade select-none absolute top-2 left-0 right-0 text-black/70 tracking-wider text-[clamp(2.8rem,10vw,6.5rem)] leading-none filter blur-sm"
          >
            BRICK
          </h1>
          {/* Extruded 3D bevel text */}
          <h1 
            className="text-3d-brick font-arcade select-none text-[clamp(2.8rem,10vw,6.5rem)] leading-[0.95] tracking-[0.06em] font-extrabold uppercase"
          >
            BRICK
          </h1>
        </div>

        {/* WORD 2: BREAKER */}
        <div className="relative -mt-1 sm:-mt-2 md:-mt-3">
          {/* Deep 3D Shadow layer */}
          <h1 
            aria-hidden="true"
            className="font-arcade select-none absolute top-2 left-0 right-0 text-black/80 tracking-widest text-[clamp(2.5rem,9.2vw,5.8rem)] leading-none filter blur-sm"
          >
            BREAKER
          </h1>
          {/* Extruded 3D bevel text */}
          <h1 
            className="text-3d-breaker font-arcade select-none text-[clamp(2.5rem,9.2vw,5.8rem)] leading-[0.95] tracking-[0.08em] font-extrabold uppercase"
          >
            BREAKER
          </h1>
        </div>

        {/* Orbiting Glowing Ball with Tail (Animated Vector Element) */}
        <div className="absolute -top-3 right-4 sm:right-12 md:right-24 pointer-events-none">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10">
            {/* Trail */}
            <div className="absolute top-2 right-2 w-12 h-3 bg-gradient-to-l from-cyan-400 to-transparent blur-[2px] rotate-[-25deg] opacity-75" />
            {/* Core Ball */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-cyan-300 shadow-[0_0_20px_#22d3ee,0_0_40px_#06b6d4,inset_0_0_8px_#ffffff] animate-ping opacity-60 absolute inset-0 m-auto" />
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border border-cyan-200 shadow-[0_0_15px_#38bdf8,inset_-2px_-2px_4px_#0284c7] relative z-10 mx-auto my-1" />
          </div>
        </div>

        {/* Futuristic Miniature Paddle at bottom of logo lockup */}
        <div className="relative mt-3 sm:mt-4 w-40 sm:w-56 md:w-64 h-3 sm:h-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-sky-300 to-cyan-500 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.8)]">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-between px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            <div className="w-16 h-1 rounded-full bg-cyan-400/80 shadow-[0_0_10px_#22d3ee]" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          </div>
        </div>
      </div>

      {/* Arcade Subtitle / Tagline */}
      <div className="mt-3 sm:mt-4 text-center">
        <p className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-cyan-200/90 drop-shadow-[0_2px_8px_rgba(6,182,212,0.6)]">
          PANTULKAN BOLA. HANCURKAN SEMUA BALOK!
        </p>
      </div>
    </div>
  );
};
