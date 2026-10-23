import React from 'react';
import { GameSettings } from '../types/game';
import { sound } from '../utils/audio';
import { X, Volume2, VolumeX, Music, Gamepad2, Sparkles, Trash2, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetProgress,
}) => {
  const [resetConfirmed, setResetConfirmed] = React.useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.35)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
          <div>
            <h2 className="font-arcade text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300">
              PENGATURAN ARKADE
            </h2>
            <p className="text-xs text-slate-400">
              Kustomisasi audio dan kontrol permainan
            </p>
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

        {/* Setting options list */}
        <div className="space-y-4 my-5">
          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-200 block">Efek Suara (SFX)</span>
                <span className="text-[11px] text-slate-400">Ledakan, pantulan, dan daya tambahan</span>
              </div>
            </div>

            <button
              onClick={() => {
                const nextVal = !settings.soundEnabled;
                sound.setMuted(!nextVal);
                onUpdateSettings({ soundEnabled: nextVal });
                if (nextVal) sound.playClick();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.soundEnabled ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Synth Music Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-200 block">Musik Synthwave</span>
                <span className="text-[11px] text-slate-400">Arpeggiator retro arkade latar</span>
              </div>
            </div>

            <button
              onClick={() => {
                const nextVal = !settings.musicEnabled;
                sound.setMusicMuted(!nextVal);
                onUpdateSettings({ musicEnabled: nextVal });
                sound.playClick();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.musicEnabled ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Control Mode Toggle */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-300">Mode Kontrol Utama</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onUpdateSettings({ controlType: 'mouse_touch' });
                }}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  settings.controlType === 'mouse_touch'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Mouse & Layar Sentuh
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onUpdateSettings({ controlType: 'keyboard' });
                }}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  settings.controlType === 'keyboard'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Keyboard (A-D / ◄ ►)
              </button>
            </div>
          </div>

          {/* Particle Density */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-300">Kerapatan Efek Partikel</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((density) => (
                <button
                  key={density}
                  onClick={() => {
                    sound.playClick();
                    onUpdateSettings({ particleDensity: density });
                  }}
                  className={`py-1.5 rounded-lg text-xs font-medium border capitalize transition-all ${
                    settings.particleDensity === density
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {density === 'low' ? 'Rendah' : density === 'medium' ? 'Sedang' : 'Tinggi'}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Progress */}
          <div className="pt-2">
            {!resetConfirmed ? (
              <button
                onClick={() => setResetConfirmed(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-rose-400/80 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 bg-rose-950/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Skor Tertinggi & Bintang</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    onResetProgress();
                    setResetConfirmed(false);
                  }}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Konfirmasi Reset</span>
                </button>
                <button
                  onClick={() => setResetConfirmed(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
