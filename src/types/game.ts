export type GameScreen = 'SPLASH' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'GAMEOVER';

export type PowerUpType = 
  | 'MULTIBALL' 
  | 'LASER' 
  | 'FIREBALL' 
  | 'WIDE_PADDLE' 
  | 'SHIELD' 
  | 'SLOW_MO' 
  | 'EXTRA_LIFE';

export interface PowerUp {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: PowerUpType;
  vy: number;
}

export interface Brick {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  type: 'normal' | 'silver' | 'gold' | 'explosive' | 'glass';
  color: string;
  accentColor: string;
  points: number;
  powerUp?: PowerUpType;
  isHit?: boolean;
}

export interface Ball {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isFireball: boolean;
  trail: { x: number; y: number; alpha: number }[];
  stuckToPaddle?: boolean;
  stuckOffsetX?: number;
}

export interface LaserBeam {
  id: string;
  x: number;
  y: number;
  vy: number;
  width: number;
  height: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  sparkle?: boolean;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

export interface GameLevel {
  id: number;
  name: string;
  subtitle: string;
  difficulty: 'Mudah' | 'Sedang' | 'Tantangan' | 'Pakar';
  bricks: Omit<Brick, 'isHit'>[];
  targetScore: number;
  ballSpeed: number;
  paddleWidth: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
  controlType: 'mouse_touch' | 'keyboard';
  particleDensity: 'low' | 'medium' | 'high';
}

export interface GameStats {
  score: number;
  highScore: number;
  combo: number;
  maxCombo: number;
  lives: number;
  level: number;
  bricksDestroyed: number;
  stars: Record<number, number>;
}
