import React from 'react';
import { GameLevel } from '../types/game';
import { Heart, Pause, Trophy, Flame } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameHUDProps {
  level: GameLevel;
  score: number;
  highScore: number;
  lives: number;
  combo: number;
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  level,
  score,
  highScore,
  lives,
  combo,
  onPause,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none px-4 py-3 flex items-center justify-between">
      {/* Left: Level name & Streak Combo */}
      <div className="flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <div className="flex items-center gap-2">
            <span className="font-arcade text-xs text-cyan-400">
              SEKTOR {level.id}
            </span>
            <span className="text-[11px] font-semibold text-slate-300 hidden sm:inline">
              {level.name}
            </span>
          </div>
        </div>

        {/* Dynamic Combo Multiplier Pill (shows when streak > 1) */}
        {combo > 1 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/50 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-bounce">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-arcade text-xs text-amber-300">
              COMBO x{Math.min(combo, 5)}
            </span>
          </div>
        )}
      </div>

      {/* Center: Live Score */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
          SKOR
        </span>
        <span className="font-arcade font-mono-num text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">
          {score.toLocaleString()}
        </span>
      </div>

      {/* Right: Lives & Pause Action */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Lives Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-rose-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(244,63,94,0.2)]">
          {[1, 2, 3, 4, 5].map((i) => (
            <Heart
              key={i}
              className={`w-4 h-4 transition-all duration-300 ${
                i <= lives
                  ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_6px_#f43f5e]'
                  : 'text-slate-700 opacity-40'
              }`}
            />
          ))}
        </div>

        {/* Pause Button */}
        <button
          onClick={() => {
            sound.playClick();
            onPause();
          }}
          title="Jeda Permainan (Esc)"
          className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-center text-cyan-300 hover:text-white backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all transform active:scale-95"
        >
          <Pause className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
