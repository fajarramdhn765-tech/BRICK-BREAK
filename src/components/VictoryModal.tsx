import React from 'react';
import { GameLevel } from '../types/game';
import { sound } from '../utils/audio';
import { Sparkles, Play, RotateCcw, Home, Trophy } from 'lucide-react';

interface VictoryModalProps {
  level: GameLevel;
  score: number;
  lives: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  level,
  score,
  lives,
  hasNextLevel,
  onNextLevel,
  onRestart,
  onHome,
}) => {
  // Compute star rating (1 to 3 stars based on lives left)
  const stars = lives >= 3 ? 3 : lives >= 2 ? 2 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900/95 border border-cyan-400/60 rounded-2xl p-6 shadow-[0_0_60px_rgba(6,182,212,0.4)] flex flex-col items-center text-center">
        {/* Glow */}
        <div className="absolute -top-12 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* 3 Stars display */}
        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`transform transition-transform ${
                starIdx === 2 ? 'scale-125 -translate-y-1' : ''
              }`}
            >
              <Sparkles
                className={`w-8 h-8 ${
                  starIdx <= stars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_#f59e0b]'
                    : 'text-slate-700'
                }`}
              />
            </div>
          ))}
        </div>

        <h2 className="font-arcade text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-cyan-300 mb-1">
          SEKTOR DIBERSIHKAN!
        </h2>
        <p className="text-xs text-slate-300 font-semibold mb-4">
          {level.name} Berhasil Ditaklukkan
        </p>

        {/* Score & Stats Card */}
        <div className="w-full bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Total Skor Sektor:</span>
            <span className="font-arcade font-mono-num text-xl text-cyan-300">
              {score.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/40">
            <span>Sisa Nyawa:</span>
            <span className="font-bold text-rose-400">{lives} ♥</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-2.5">
          {hasNextLevel ? (
            <button
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="btn-glossy w-full py-3 px-4 rounded-xl font-arcade text-sm uppercase text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 border border-emerald-300/80 shadow-[0_0_25px_rgba(16,185,129,0.6)] flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>SEKTOR SELANJUTNYA</span>
            </button>
          ) : (
            <div className="py-2.5 px-3 rounded-xl bg-amber-500/20 border border-amber-400/50 text-xs font-bold text-amber-300">
              🏆 SELAMAT! ANDA TELAH MENYELESAIKAN SEMUA LEVEL!
            </div>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>MAIN ULANG LEVEL INI</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onHome();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>KEMBALI KE MENU UTAMA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
