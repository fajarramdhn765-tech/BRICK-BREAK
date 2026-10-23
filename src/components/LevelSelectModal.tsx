import React from 'react';
import { GameLevel } from '../types/game';
import { sound } from '../utils/audio';
import { X, Play, Trophy, Sparkles } from 'lucide-react';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  levels: GameLevel[];
  onSelectLevel: (levelId: number) => void;
  starsMap: Record<number, number>;
  highScore: number;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  levels,
  onSelectLevel,
  starsMap,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.35)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Glow corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-arcade text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-cyan-300">
                PILIH SEKTOR LEVEL
              </h2>
              <p className="text-xs text-slate-400">
                Taklukkan semua tantangan arkade kustom
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-cyan-400/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4 overflow-y-auto pr-1">
          {levels.map((lvl) => {
            const stars = starsMap[lvl.id] || 0;
            const diffColor = 
              lvl.difficulty === 'Mudah' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30' :
              lvl.difficulty === 'Sedang' ? 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30' :
              lvl.difficulty === 'Tantangan' ? 'text-amber-400 border-amber-500/30 bg-amber-950/30' :
              'text-rose-400 border-rose-500/30 bg-rose-950/30';

            return (
              <div
                key={lvl.id}
                onMouseEnter={() => sound.playHover()}
                onClick={() => {
                  sound.playClick();
                  onSelectLevel(lvl.id);
                }}
                className="group relative p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800/90 border border-slate-700/60 hover:border-cyan-400/80 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-arcade text-lg text-white group-hover:text-cyan-300">
                      LEVEL {lvl.id}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${diffColor}`}>
                      {lvl.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {lvl.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">
                    {lvl.subtitle}
                  </p>
                </div>

                {/* Stars & Launch CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((starIdx) => (
                      <Sparkles
                        key={starIdx}
                        className={`w-3.5 h-3.5 ${
                          starIdx <= stars 
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_#f59e0b]' 
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Main</span>
                    <Play className="w-3 h-3 fill-cyan-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer controls */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
