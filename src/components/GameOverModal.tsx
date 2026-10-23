import React from 'react';
import { sound } from '../utils/audio';
import { RotateCcw, Home, Trophy, Skull } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHigh: boolean;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHigh,
  onRestart,
  onHome,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900/95 border border-rose-500/50 rounded-2xl p-6 shadow-[0_0_60px_rgba(244,63,94,0.35)] flex flex-col items-center text-center">
        {/* Skull Icon badge */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-center text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)] mb-3">
          <Skull className="w-7 h-7" />
        </div>

        <h2 className="font-arcade text-3xl text-rose-500 tracking-wider mb-1 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]">
          GAME OVER
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          Bola jatuh dan energi paddle telah habis!
        </p>

        {/* Score comparison card */}
        <div className="w-full bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Skor Akhir:</span>
            <span className="font-arcade font-mono-num text-xl text-white">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
            <div className="flex items-center gap-1.5 text-xs text-amber-400">
              <Trophy className="w-3.5 h-3.5" />
              <span>Skor Terbaik:</span>
            </div>
            <span className="font-arcade font-mono-num text-sm text-amber-300">
              {highScore.toLocaleString()}
            </span>
          </div>

          {isNewHigh && (
            <div className="mt-3 py-1 px-2.5 rounded-lg bg-amber-500/20 border border-amber-400/50 text-[11px] font-bold text-amber-300 animate-pulse">
              🎉 REKOR SKOR BARU DICAPAI!
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="w-full space-y-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="btn-glossy w-full py-3 px-4 rounded-xl font-arcade text-sm uppercase text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-amber-400 border border-amber-300/80 shadow-[0_0_25px_rgba(245,158,11,0.6)] flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>COBA LAGI</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onHome();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>MENU UTAMA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
