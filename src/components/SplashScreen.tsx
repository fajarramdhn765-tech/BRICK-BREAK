import React, { useEffect } from 'react';
import { SplashBackground } from './SplashBackground';
import { SplashLogo3D } from './SplashLogo3D';
import { sound } from '../utils/audio';
import { Play, Grid, Settings2, Volume2, VolumeX, Trophy, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenSettings: () => void;
  highScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onStartGame,
  onOpenLevelSelect,
  onOpenSettings,
  highScore,
  soundEnabled,
  onToggleSound,
}) => {
  // Listen for Enter / Space hotkey to instantly start playing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        sound.playClick();
        onStartGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame]);

  return (
    <div 
      className="relative w-full min-h-[100dvh] h-screen overflow-hidden flex flex-col justify-between items-center text-white select-none"
      style={{
        width: '100vw',
        height: '100dvh',
      }}
    >
      {/* 1. Fullscreen Dynamic Background */}
      <SplashBackground />

      {/* 2. Top Bar Perimeter Controls */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 flex items-center justify-between">
        {/* High Score Trophy Cluster */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/70 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Trophy className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_#f59e0b]" />
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">SKOR TERTINGGI</span>
            <span className="font-mono-num font-bold text-amber-300">
              {highScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Sound Toggle Button */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            title={soundEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
            className="w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-850 border border-cyan-500/30 hover:border-cyan-400/80 flex items-center justify-center text-cyan-300 hover:text-white backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all transform hover:scale-105 active:scale-95"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 drop-shadow-[0_0_8px_#06b6d4]" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>
      </header>

      {/* 3. Centerpiece 3D Logo Lockup */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center w-full px-4 my-auto">
        {/* Animated 3D Logo */}
        <div className="transform transition-transform duration-500 hover:scale-[1.01]">
          <SplashLogo3D />
        </div>

        {/* Action Button Strip */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto mt-6 sm:mt-8 flex flex-col items-center gap-3">
          {/* MAIN START CTA BUTTON ▶ MULAI MAIN */}
          <button
            onClick={() => {
              sound.playClick();
              onStartGame();
            }}
            onMouseEnter={() => sound.playHover()}
            className="btn-glossy group relative w-full sm:w-80 py-3.5 sm:py-4 px-8 rounded-xl font-arcade text-lg sm:text-xl tracking-wider text-white uppercase bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:via-orange-400 hover:to-amber-400 border-2 border-yellow-300/80 shadow-[0_0_35px_rgba(245,158,11,0.7),inset_0_2px_4px_rgba(255,255,255,0.7)] hover:shadow-[0_0_50px_rgba(245,158,11,0.9),inset_0_2px_8px_rgba(255,255,255,0.9)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform" />
            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-extrabold">
              MULAI MAIN
            </span>
          </button>

          {/* Secondary Buttons Row: PILIH LEVEL & PENGATURAN */}
          <div className="w-full sm:w-80 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                sound.playClick();
                onOpenLevelSelect();
              }}
              onMouseEnter={() => sound.playHover()}
              className="py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm tracking-wide text-cyan-200 bg-slate-900/80 hover:bg-slate-800/90 border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.45)] backdrop-blur-md transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Grid className="w-4 h-4 text-cyan-400" />
              <span>PILIH LEVEL</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenSettings();
              }}
              onMouseEnter={() => sound.playHover()}
              className="py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm tracking-wide text-cyan-200 bg-slate-900/80 hover:bg-slate-800/90 border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.45)] backdrop-blur-md transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Settings2 className="w-4 h-4 text-cyan-400" />
              <span>PENGATURAN</span>
            </button>
          </div>
        </div>
      </main>

      {/* 4. Footer Game Info & Controls Guide */}
      <footer className="relative z-20 w-full max-w-4xl mx-auto px-4 pb-4 sm:pb-6 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-slate-400/90 backdrop-blur-sm py-1.5 px-4 rounded-full bg-slate-950/40 border border-slate-800/50 w-fit mx-auto">
          <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Kontrol: Mouse / Sentuh Layar atau Panah ◄ ►</span>
          </span>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span className="text-slate-300">
            Tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-amber-300 font-mono border border-slate-700">SPASI</kbd> atau <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-amber-300 font-mono border border-slate-700">ENTER</kbd> untuk Mulai
          </span>
        </div>
      </footer>
    </div>
  );
};
