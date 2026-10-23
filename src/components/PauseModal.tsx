import React from 'react';
import { sound } from '../utils/audio';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onHome,
  soundEnabled,
  onToggleSound,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.35)] flex flex-col items-center text-center">
        <h2 className="font-arcade text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-cyan-300 mb-1">
          PERMAINAN DIJEDA
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Tekan Lanjutkan untuk kembali beraksi
        </p>

        <div className="w-full space-y-3">
          {/* Resume */}
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="btn-glossy w-full py-3 px-4 rounded-xl font-arcade text-sm uppercase text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border border-cyan-300/80 shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>LANJUTKAN</span>
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-cyan-400/50 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ULANGI LEVEL INI</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-cyan-400/50 transition-colors flex items-center justify-center gap-2"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>{soundEnabled ? 'SUARA: AKTIF' : 'SUARA: BISU'}</span>
          </button>

          {/* Back to Title Menu */}
          <button
            onClick={() => {
              sound.playClick();
              onHome();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-300/90 hover:text-rose-200 bg-rose-950/30 hover:bg-rose-950/50 border border-rose-500/30 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>KEMBALI KE MENU UTAMA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
