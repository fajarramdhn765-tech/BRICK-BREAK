import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GameScreen, GameSettings, GameStats } from './types/game';
import { createLevels } from './utils/levels';
import { sound } from './utils/audio';
import { SplashScreen } from './components/SplashScreen';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { LevelSelectModal } from './components/LevelSelectModal';
import { SettingsModal } from './components/SettingsModal';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';

export default function App() {
  const levels = useMemo(() => createLevels(), []);
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [screen, setScreen] = useState<GameScreen>('SPLASH');

  // Modals on Splash
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Settings State
  const [settings, setSettings] = useState<GameSettings>(() => ({
    soundEnabled: !sound.getIsMuted(),
    musicEnabled: !sound.getIsMusicMuted(),
    sfxVolume: 0.7,
    musicVolume: 0.35,
    controlType: 'mouse_touch',
    particleDensity: 'high',
  }));

  // Gameplay State
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [lives, setLives] = useState<number>(3);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('brick_breaker_highscore');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [starsMap, setStarsMap] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('brick_breaker_stars');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const currentLevel = useMemo(() => {
    return levels.find((l) => l.id === currentLevelId) || levels[0];
  }, [levels, currentLevelId]);

  // Update high score whenever score exceeds it
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      setIsNewHighScore(true);
      try {
        localStorage.setItem('brick_breaker_highscore', score.toString());
      } catch {}
    }
  }, [score, highScore]);

  // Master Sound Toggle
  const handleToggleSound = useCallback(() => {
    const nextVal = !settings.soundEnabled;
    sound.setMuted(!nextVal);
    setSettings((prev) => ({ ...prev, soundEnabled: nextVal }));
  }, [settings.soundEnabled]);

  // Update Settings Partial
  const handleUpdateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Reset Progress
  const handleResetProgress = useCallback(() => {
    setHighScore(0);
    setStarsMap({});
    try {
      localStorage.removeItem('brick_breaker_highscore');
      localStorage.removeItem('brick_breaker_stars');
    } catch {}
  }, []);

  // Start Playing
  const handleStartGame = useCallback((levelId: number = 1) => {
    setCurrentLevelId(levelId);
    setScore(0);
    setCombo(1);
    setLives(3);
    setIsNewHighScore(false);
    setScreen('PLAYING');
    setIsLevelSelectOpen(false);
    setIsSettingsOpen(false);
    if (settings.musicEnabled && settings.soundEnabled) {
      sound.startMusic();
    }
  }, [settings.musicEnabled, settings.soundEnabled]);

  // Pause / Resume Handlers
  const handlePause = useCallback(() => {
    setScreen('PAUSED');
  }, []);

  const handleResume = useCallback(() => {
    setScreen('PLAYING');
  }, []);

  const handleRestartLevel = useCallback(() => {
    setScore(0);
    setCombo(1);
    setLives(3);
    setIsNewHighScore(false);
    setScreen('PLAYING');
  }, []);

  const handleReturnHome = useCallback(() => {
    setScreen('SPLASH');
  }, []);

  // Gameplay Callbacks
  const handleScoreAdd = useCallback((pts: number) => {
    setScore((prev) => prev + pts);
  }, []);

  const handleComboChange = useCallback((newCombo: number) => {
    setCombo(newCombo);
  }, []);

  const handleLifeLost = useCallback(() => {
    setLives((prev) => Math.max(0, prev - 1));
  }, []);

  const handleLifeGain = useCallback(() => {
    setLives((prev) => Math.min(5, prev + 1));
  }, []);

  const handleGameOver = useCallback(() => {
    setScreen('GAMEOVER');
  }, []);

  const handleLevelComplete = useCallback(() => {
    const calculatedStars = lives >= 3 ? 3 : lives >= 2 ? 2 : 1;
    setStarsMap((prev) => {
      const currentStar = prev[currentLevelId] || 0;
      const updated = { ...prev, [currentLevelId]: Math.max(currentStar, calculatedStars) };
      try {
        localStorage.setItem('brick_breaker_stars', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setScreen('VICTORY');
  }, [lives, currentLevelId]);

  const handleNextLevel = useCallback(() => {
    const nextId = currentLevelId + 1;
    if (nextId <= levels.length) {
      setCurrentLevelId(nextId);
      setLives(3);
      setCombo(1);
      setScreen('PLAYING');
    } else {
      setScreen('SPLASH');
    }
  }, [currentLevelId, levels.length]);

  // Global Keyboard: Escape to Pause/Resume
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        if (screen === 'PLAYING') {
          handlePause();
        } else if (screen === 'PAUSED') {
          handleResume();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, handlePause, handleResume]);

  return (
    <div 
      className="relative w-full min-h-[100dvh] h-screen overflow-hidden bg-[#040914] text-slate-100 flex flex-col"
      style={{
        width: '100vw',
        height: '100dvh',
      }}
    >
      {/* 1. SPLASH SCREEN (Default View) */}
      {screen === 'SPLASH' && (
        <SplashScreen
          onStartGame={() => handleStartGame(1)}
          onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          highScore={highScore}
          soundEnabled={settings.soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      {/* 2. GAMEPLAY VIEW */}
      {screen !== 'SPLASH' && (
        <div className="relative w-full h-full overflow-hidden">
          {/* Background Layer during play */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/arcade_bg.jpg')",
              backgroundColor: '#040914',
            }}
          >
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]" />
            <div className="absolute inset-0 energy-grid opacity-25" />
          </div>

          {/* Game HUD */}
          <GameHUD
            level={currentLevel}
            score={score}
            highScore={highScore}
            lives={lives}
            combo={combo}
            onPause={handlePause}
          />

          {/* Canvas Engine */}
          <GameCanvas
            level={currentLevel}
            settings={settings}
            lives={lives}
            score={score}
            combo={combo}
            onScoreAdd={handleScoreAdd}
            onComboChange={handleComboChange}
            onLifeLost={handleLifeLost}
            onLifeGain={handleLifeGain}
            onLevelComplete={handleLevelComplete}
            onGameOver={handleGameOver}
            isPaused={screen === 'PAUSED'}
          />

          {/* Pause Modal */}
          <PauseModal
            isOpen={screen === 'PAUSED'}
            onResume={handleResume}
            onRestart={handleRestartLevel}
            onHome={handleReturnHome}
            soundEnabled={settings.soundEnabled}
            onToggleSound={handleToggleSound}
          />

          {/* Game Over Modal */}
          {screen === 'GAMEOVER' && (
            <GameOverModal
              score={score}
              highScore={highScore}
              isNewHigh={isNewHighScore}
              onRestart={handleRestartLevel}
              onHome={handleReturnHome}
            />
          )}

          {/* Victory Modal */}
          {screen === 'VICTORY' && (
            <VictoryModal
              level={currentLevel}
              score={score}
              lives={lives}
              hasNextLevel={currentLevelId < levels.length}
              onNextLevel={handleNextLevel}
              onRestart={handleRestartLevel}
              onHome={handleReturnHome}
            />
          )}
        </div>
      )}

      {/* 3. MODALS ACCESSIBLE FROM SPLASH */}
      <LevelSelectModal
        isOpen={isLevelSelectOpen}
        onClose={() => setIsLevelSelectOpen(false)}
        levels={levels}
        onSelectLevel={(lvlId) => handleStartGame(lvlId)}
        starsMap={starsMap}
        highScore={highScore}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
