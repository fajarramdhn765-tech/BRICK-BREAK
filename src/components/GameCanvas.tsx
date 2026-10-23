import React, { useEffect, useRef } from 'react';
import { Brick, Ball, PowerUp, LaserBeam, Particle, FloatingText, GameLevel, GameSettings } from '../types/game';
import { sound } from '../utils/audio';

interface GameCanvasProps {
  level: GameLevel;
  settings: GameSettings;
  lives: number;
  score: number;
  combo: number;
  onScoreAdd: (pts: number) => void;
  onComboChange: (combo: number) => void;
  onLifeLost: () => void;
  onLifeGain: () => void;
  onLevelComplete: () => void;
  onGameOver: () => void;
  isPaused: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  settings,
  lives,
  score,
  combo,
  onScoreAdd,
  onComboChange,
  onLifeLost,
  onLifeGain,
  onLevelComplete,
  onGameOver,
  isPaused,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mutable Game Simulation State (Isolated from React re-renders)
  const stateRef = useRef({
    paddleX: 0,
    paddleWidth: level.paddleWidth,
    paddleHeight: 16,
    isLaserActive: false,
    laserTimer: 0,
    isFireballActive: false,
    fireballTimer: 0,
    isShieldActive: false,
    hasStarted: false,
    balls: [] as Ball[],
    bricks: [] as Brick[],
    powerUps: [] as PowerUp[],
    lasers: [] as LaserBeam[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    screenShake: 0,
    keys: { left: false, right: false, space: false },
    lastLaserShot: 0,
  });

  // Keep references to callbacks to avoid closure staleness in game loop
  const callbacksRef = useRef({
    onScoreAdd,
    onComboChange,
    onLifeLost,
    onLifeGain,
    onLevelComplete,
    onGameOver,
    lives,
    isPaused,
  });

  useEffect(() => {
    callbacksRef.current = {
      onScoreAdd,
      onComboChange,
      onLifeLost,
      onLifeGain,
      onLevelComplete,
      onGameOver,
      lives,
      isPaused,
    };
  }, [onScoreAdd, onComboChange, onLifeLost, onLifeGain, onLevelComplete, onGameOver, lives, isPaused]);

  // Initialize Level Geometry when Level changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    const playAreaWidth = Math.min(width * 0.92, 900);
    const playAreaLeft = (width - playAreaWidth) / 2;
    const brickTopOffset = Math.max(height * 0.14, 90);

    // Calculate grid brick dimensions
    const maxCols = 12;
    const brickSpacing = 8;
    const baseBrickWidth = (playAreaWidth - (maxCols - 1) * brickSpacing) / maxCols;
    const baseBrickHeight = Math.min(height * 0.04, 28);

    const mappedBricks: Brick[] = level.bricks.map((b) => ({
      ...b,
      x: playAreaLeft + b.x * (baseBrickWidth + brickSpacing),
      y: brickTopOffset + b.y * (baseBrickHeight + brickSpacing),
      width: baseBrickWidth * b.width,
      height: baseBrickHeight * b.height,
      isHit: false,
    }));

    const paddleInitialWidth = Math.min(level.paddleWidth * (width < 640 ? 0.85 : 1), width * 0.35);

    stateRef.current = {
      paddleX: width / 2 - paddleInitialWidth / 2,
      paddleWidth: paddleInitialWidth,
      paddleHeight: 16,
      isLaserActive: false,
      laserTimer: 0,
      isFireballActive: false,
      fireballTimer: 0,
      isShieldActive: false,
      hasStarted: false,
      balls: [
        {
          id: 'initial_ball',
          x: width / 2,
          y: height - 60,
          vx: level.ballSpeed * (Math.random() > 0.5 ? 0.7 : -0.7),
          vy: -level.ballSpeed,
          radius: 8,
          isFireball: false,
          trail: [],
          stuckToPaddle: true,
          stuckOffsetX: 0,
        },
      ],
      bricks: mappedBricks,
      powerUps: [],
      lasers: [],
      particles: [],
      floatingTexts: [],
      screenShake: 0,
      keys: { left: false, right: false, space: false },
      lastLaserShot: 0,
    };
  }, [level]);

  // Main 60FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTimestamp = performance.now();

    // Helper: spawn brick particles
    const spawnBrickParticles = (brick: Brick, count: number = 14) => {
      const state = stateRef.current;
      const densityMult = settings.particleDensity === 'low' ? 0.5 : settings.particleDensity === 'high' ? 1.4 : 1.0;
      const finalCount = Math.floor(count * densityMult);

      for (let i = 0; i < finalCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1.5;
        state.particles.push({
          x: brick.x + brick.width / 2,
          y: brick.y + brick.height / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 3.5 + 1.5,
          color: Math.random() > 0.3 ? brick.color : brick.accentColor,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
        });
      }
    };

    // Helper: spawn floating text
    const spawnFloatingText = (x: number, y: number, text: string, color: string) => {
      stateRef.current.floatingTexts.push({
        id: Math.random().toString(),
        x,
        y,
        text,
        color,
        alpha: 1,
        vy: -1.2,
      });
    };

    // Helper: trigger screen shake
    const triggerShake = (amount: number) => {
      stateRef.current.screenShake = Math.max(stateRef.current.screenShake, amount);
    };

    // Launch Ball
    const launchBall = () => {
      const state = stateRef.current;
      if (!state.hasStarted) {
        state.hasStarted = true;
        state.balls.forEach((b) => {
          if (b.stuckToPaddle) {
            b.stuckToPaddle = false;
            b.vy = -level.ballSpeed;
            b.vx = (Math.random() - 0.5) * level.ballSpeed;
          }
        });
        sound.playPaddleBounce(0.5);
      }
    };

    // Fire Laser
    const fireLaser = () => {
      const state = stateRef.current;
      const now = performance.now();
      if (!state.isLaserActive || now - state.lastLaserShot < 260) return;

      state.lastLaserShot = now;
      sound.playLaser();

      const pX = state.paddleX;
      const pY = canvas.height - 40;
      const pW = state.paddleWidth;

      state.lasers.push(
        { id: Math.random().toString(), x: pX + 12, y: pY, vy: -12, width: 4, height: 16 },
        { id: Math.random().toString(), x: pX + pW - 16, y: pY, vy: -12, width: 4, height: 16 }
      );
    };

    // Keyboard handlers
    const onKeyDown = (e: KeyboardEvent) => {
      const state = stateRef.current;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') state.keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') state.keys.right = true;
      if (e.code === 'Space') {
        e.preventDefault();
        if (!state.hasStarted) {
          launchBall();
        } else if (state.isLaserActive) {
          fireLaser();
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const state = stateRef.current;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') state.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') state.keys.right = false;
    };

    // Pointer handlers (Mouse & Touch)
    const onPointerMove = (e: PointerEvent) => {
      const state = stateRef.current;
      const canvasX = e.clientX;
      state.paddleX = Math.max(0, Math.min(canvas.width - state.paddleWidth, canvasX - state.paddleWidth / 2));
    };

    const onPointerDown = () => {
      const state = stateRef.current;
      if (!state.hasStarted) {
        launchBall();
      } else if (state.isLaserActive) {
        fireLaser();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);

    // Frame Update & Render Loop
    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
      lastTimestamp = timestamp;

      const width = canvas.width;
      const height = canvas.height;
      const state = stateRef.current;
      const { isPaused } = callbacksRef.current;

      if (!isPaused) {
        // Handle keyboard continuous movement
        const paddleSpeed = 750 * dt;
        if (state.keys.left) {
          state.paddleX = Math.max(0, state.paddleX - paddleSpeed);
        }
        if (state.keys.right) {
          state.paddleX = Math.min(width - state.paddleWidth, state.paddleX + paddleSpeed);
        }

        // Timer countdowns for power-ups
        if (state.isLaserActive) {
          state.laserTimer -= dt;
          if (state.laserTimer <= 0) state.isLaserActive = false;
        }
        if (state.isFireballActive) {
          state.fireballTimer -= dt;
          if (state.fireballTimer <= 0) {
            state.isFireballActive = false;
            state.balls.forEach((b) => (b.isFireball = false));
          }
        }

        // Screen shake decay
        if (state.screenShake > 0) {
          state.screenShake = Math.max(0, state.screenShake - dt * 25);
        }

        const paddleY = height - 42;

        // 1. Update Balls
        for (let bIdx = state.balls.length - 1; bIdx >= 0; bIdx--) {
          const ball = state.balls[bIdx];

          if (ball.stuckToPaddle) {
            ball.x = state.paddleX + state.paddleWidth / 2 + (ball.stuckOffsetX || 0);
            ball.y = paddleY - ball.radius;
            continue;
          }

          // Trail
          ball.trail.unshift({ x: ball.x, y: ball.y, alpha: 0.7 });
          if (ball.trail.length > 8) ball.trail.pop();

          ball.x += ball.vx;
          ball.y += ball.vy;

          // Wall Collisions
          if (ball.x - ball.radius <= 0) {
            ball.x = ball.radius;
            ball.vx = Math.abs(ball.vx);
            sound.playPaddleBounce(0.3);
          } else if (ball.x + ball.radius >= width) {
            ball.x = width - ball.radius;
            ball.vx = -Math.abs(ball.vx);
            sound.playPaddleBounce(0.3);
          }

          if (ball.y - ball.radius <= 0) {
            ball.y = ball.radius;
            ball.vy = Math.abs(ball.vy);
            sound.playPaddleBounce(0.3);
          }

          // Bottom Wall Collision / Death
          if (ball.y + ball.radius >= height) {
            // Check if safety shield is active
            if (state.isShieldActive) {
              state.isShieldActive = false;
              ball.y = height - ball.radius - 10;
              ball.vy = -Math.abs(ball.vy);
              sound.playPaddleBounce(0.9);
              spawnFloatingText(width / 2, height - 60, 'PERISAI DIGUNAKAN!', '#06B6D4');
              triggerShake(5);
            } else {
              // Remove ball
              state.balls.splice(bIdx, 1);
              continue;
            }
          }

          // Paddle Collision
          if (
            ball.y + ball.radius >= paddleY &&
            ball.y - ball.radius <= paddleY + state.paddleHeight &&
            ball.x >= state.paddleX - 4 &&
            ball.x <= state.paddleX + state.paddleWidth + 4 &&
            ball.vy > 0
          ) {
            ball.y = paddleY - ball.radius;
            // Angle deflection calculation (-1 to +1 from paddle center)
            const hitOffset = (ball.x - (state.paddleX + state.paddleWidth / 2)) / (state.paddleWidth / 2);
            const maxAngle = (75 * Math.PI) / 180;
            const bounceAngle = hitOffset * maxAngle;
            const currentSpeed = Math.hypot(ball.vx, ball.vy);

            ball.vx = currentSpeed * Math.sin(bounceAngle);
            ball.vy = -currentSpeed * Math.cos(bounceAngle);

            sound.playPaddleBounce(Math.abs(hitOffset));
            callbacksRef.current.onComboChange(1); // Reset streak combo when paddle is touched
          }

          // Brick Collisions
          for (let brickIdx = state.bricks.length - 1; brickIdx >= 0; brickIdx--) {
            const brick = state.bricks[brickIdx];

            // AABB vs Circle
            const closestX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.width));
            const closestY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.height));
            const distX = ball.x - closestX;
            const distY = ball.y - closestY;
            const distSq = distX * distX + distY * distY;

            if (distSq < ball.radius * ball.radius) {
              // Brick Hit!
              if (!ball.isFireball) {
                // Deflect ball
                const overlapX = ball.radius - Math.abs(distX);
                const overlapY = ball.radius - Math.abs(distY);

                if (overlapX < overlapY) {
                  ball.vx = -ball.vx;
                } else {
                  ball.vy = -ball.vy;
                }
              }

              brick.hp -= 1;
              brick.isHit = true;

              if (brick.hp <= 0) {
                // Destroyed Brick
                state.bricks.splice(brickIdx, 1);
                spawnBrickParticles(brick, 16);

                const currentCombo = combo + 1;
                callbacksRef.current.onComboChange(currentCombo);

                const comboMultiplier = Math.min(currentCombo, 5);
                const earnedPoints = brick.points * comboMultiplier;
                callbacksRef.current.onScoreAdd(earnedPoints);

                sound.playBrickBreak(currentCombo);

                // Show floating text
                const textMsg = comboMultiplier > 1 ? `+${earnedPoints} (x${comboMultiplier})` : `+${earnedPoints}`;
                spawnFloatingText(brick.x + brick.width / 2, brick.y, textMsg, brick.color);

                // If explosive brick, trigger chain reaction
                if (brick.type === 'explosive') {
                  sound.playExplosion();
                  triggerShake(8);

                  // Shatter nearby bricks within blast radius
                  const blastRadius = 90;
                  for (let n = state.bricks.length - 1; n >= 0; n--) {
                    const nb = state.bricks[n];
                    const nbDist = Math.hypot(
                      nb.x + nb.width / 2 - (brick.x + brick.width / 2),
                      nb.y + nb.height / 2 - (brick.y + brick.height / 2)
                    );
                    if (nbDist < blastRadius) {
                      nb.hp -= 1;
                      if (nb.hp <= 0) {
                        state.bricks.splice(n, 1);
                        spawnBrickParticles(nb, 10);
                        callbacksRef.current.onScoreAdd(nb.points);
                      }
                    }
                  }
                }

                // Check for Powerup Drop
                if (brick.powerUp) {
                  state.powerUps.push({
                    id: Math.random().toString(),
                    x: brick.x + brick.width / 2 - 14,
                    y: brick.y + brick.height / 2,
                    width: 28,
                    height: 18,
                    type: brick.powerUp,
                    vy: 2.2,
                  });
                }
              } else {
                // Brick took damage but still alive
                sound.playBrickHit();
                spawnBrickParticles(brick, 5);
              }

              break; // Prevent multi-brick single frame jump
            }
          }
        }

        // Handle when all balls are lost
        if (state.balls.length === 0 && state.hasStarted) {
          sound.playBallLost();
          triggerShake(10);
          callbacksRef.current.onLifeLost();

          if (callbacksRef.current.lives <= 1) {
            callbacksRef.current.onGameOver();
            return;
          } else {
            // Respawn single ball attached to paddle
            state.hasStarted = false;
            state.balls = [
              {
                id: 'respawned_ball',
                x: state.paddleX + state.paddleWidth / 2,
                y: paddleY - 8,
                vx: 0,
                vy: 0,
                radius: 8,
                isFireball: false,
                trail: [],
                stuckToPaddle: true,
                stuckOffsetX: 0,
              },
            ];
          }
        }

        // Check Victory (all destroyable bricks cleared)
        if (state.bricks.length === 0) {
          sound.playVictory();
          callbacksRef.current.onLevelComplete();
          return;
        }

        // 2. Update Lasers
        for (let lIdx = state.lasers.length - 1; lIdx >= 0; lIdx--) {
          const laser = state.lasers[lIdx];
          laser.y += laser.vy;

          if (laser.y < 0) {
            state.lasers.splice(lIdx, 1);
            continue;
          }

          // Check laser vs brick
          for (let bIdx = state.bricks.length - 1; bIdx >= 0; bIdx--) {
            const brick = state.bricks[bIdx];
            if (
              laser.x >= brick.x &&
              laser.x <= brick.x + brick.width &&
              laser.y >= brick.y &&
              laser.y <= brick.y + brick.height
            ) {
              brick.hp -= 1;
              state.lasers.splice(lIdx, 1);

              if (brick.hp <= 0) {
                state.bricks.splice(bIdx, 1);
                spawnBrickParticles(brick, 12);
                callbacksRef.current.onScoreAdd(brick.points);
                sound.playBrickBreak(1);
              } else {
                sound.playBrickHit();
              }
              break;
            }
          }
        }

        // 3. Update Powerups
        for (let pIdx = state.powerUps.length - 1; pIdx >= 0; pIdx--) {
          const p = state.powerUps[pIdx];
          p.y += p.vy;

          // Paddle collect powerup
          if (
            p.y + p.height >= paddleY &&
            p.y <= paddleY + state.paddleHeight &&
            p.x + p.width >= state.paddleX &&
            p.x <= state.paddleX + state.paddleWidth
          ) {
            sound.playPowerUpCollect();
            state.powerUps.splice(pIdx, 1);

            switch (p.type) {
              case 'MULTIBALL': {
                // Split each existing ball into 3 balls with differing angles
                const currentBalls = [...state.balls];
                currentBalls.forEach((b) => {
                  const angle = Math.atan2(b.vy, b.vx);
                  const speed = Math.hypot(b.vx, b.vy);
                  state.balls.push(
                    {
                      id: Math.random().toString(),
                      x: b.x,
                      y: b.y,
                      vx: speed * Math.cos(angle - 0.4),
                      vy: speed * Math.sin(angle - 0.4),
                      radius: b.radius,
                      isFireball: b.isFireball,
                      trail: [],
                    },
                    {
                      id: Math.random().toString(),
                      x: b.x,
                      y: b.y,
                      vx: speed * Math.cos(angle + 0.4),
                      vy: speed * Math.sin(angle + 0.4),
                      radius: b.radius,
                      isFireball: b.isFireball,
                      trail: [],
                    }
                  );
                });
                spawnFloatingText(p.x, p.y, 'MULTI-BOLA x3!', '#06B6D4');
                break;
              }
              case 'LASER': {
                state.isLaserActive = true;
                state.laserTimer = 12; // 12 seconds
                spawnFloatingText(p.x, p.y, 'MERIAM LASER!', '#EF4444');
                break;
              }
              case 'FIREBALL': {
                state.isFireballActive = true;
                state.fireballTimer = 10;
                state.balls.forEach((b) => (b.isFireball = true));
                spawnFloatingText(p.x, p.y, 'BOLA API PLASMA!', '#F97316');
                break;
              }
              case 'WIDE_PADDLE': {
                state.paddleWidth = Math.min(width * 0.45, state.paddleWidth * 1.35);
                setTimeout(() => {
                  stateRef.current.paddleWidth = Math.min(level.paddleWidth, width * 0.35);
                }, 14000);
                spawnFloatingText(p.x, p.y, 'PADDLE MEGARAY!', '#10B981');
                break;
              }
              case 'SHIELD': {
                state.isShieldActive = true;
                spawnFloatingText(p.x, p.y, 'PERISAI DASAR AKTIF!', '#38BDF8');
                break;
              }
              case 'EXTRA_LIFE': {
                callbacksRef.current.onLifeGain();
                spawnFloatingText(p.x, p.y, '+1 NYAWA!', '#EC4899');
                break;
              }
              case 'SLOW_MO': {
                state.balls.forEach((b) => {
                  b.vx *= 0.7;
                  b.vy *= 0.7;
                });
                spawnFloatingText(p.x, p.y, 'WAKTU LAMBAT!', '#A855F7');
                break;
              }
            }

            continue;
          }

          // Out of screen
          if (p.y > height) {
            state.powerUps.splice(pIdx, 1);
          }
        }

        // 4. Update Particles
        for (let ptIdx = state.particles.length - 1; ptIdx >= 0; ptIdx--) {
          const pt = state.particles[ptIdx];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.alpha -= pt.decay;
          if (pt.alpha <= 0) {
            state.particles.splice(ptIdx, 1);
          }
        }

        // 5. Update Floating Texts
        for (let ftIdx = state.floatingTexts.length - 1; ftIdx >= 0; ftIdx--) {
          const ft = state.floatingTexts[ftIdx];
          ft.y += ft.vy;
          ft.alpha -= 0.018;
          if (ft.alpha <= 0) {
            state.floatingTexts.splice(ftIdx, 1);
          }
        }
      }

      // ==========================================
      // RENDERING SECTION (HIGH FIDELITY ARCADE)
      // ==========================================
      ctx.save();

      // Camera Shake Transform
      if (state.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * state.screenShake;
        const shakeY = (Math.random() - 0.5) * state.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      ctx.clearRect(0, 0, width, height);

      // Bottom Shield Barrier line
      if (state.isShieldActive) {
        ctx.save();
        ctx.strokeStyle = '#06B6D4';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#06B6D4';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(0, height - 6);
        ctx.lineTo(width, height - 6);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Bricks
      state.bricks.forEach((b) => {
        ctx.save();
        // Outer Glow
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 10;

        // Brick Body Gradient
        const grad = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.height);
        grad.addColorStop(0, b.accentColor);
        grad.addColorStop(0.3, b.color);
        grad.addColorStop(1, '#020617');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.width, b.height, 4);
        ctx.fill();

        // 3D Bevel Rim
        ctx.strokeStyle = b.accentColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Gloss highlight stripe on top edge
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fillRect(b.x + 2, b.y + 2, b.width - 4, 3);

        // Brick Type Icon / HP indicator
        if (b.type === 'explosive') {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡ TNT', b.x + b.width / 2, b.y + b.height / 2);
        } else if (b.maxHp > 1) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`x${b.hp}`, b.x + b.width / 2, b.y + b.height / 2);
        }

        ctx.restore();
      });

      // Draw PowerUps
      state.powerUps.forEach((p) => {
        ctx.save();
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 12;

        const pGrad = ctx.createLinearGradient(p.x, p.y, p.x + p.width, p.y + p.height);
        pGrad.addColorStop(0, '#F59E0B');
        pGrad.addColorStop(1, '#EF4444');

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.width, p.height, 8);
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // PowerUp symbol
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const label =
          p.type === 'MULTIBALL' ? '3x' :
          p.type === 'LASER' ? '⚡' :
          p.type === 'FIREBALL' ? '🔥' :
          p.type === 'WIDE_PADDLE' ? '↔' :
          p.type === 'SHIELD' ? '🛡' :
          p.type === 'EXTRA_LIFE' ? '♥' : '⏱';
        ctx.fillText(label, p.x + p.width / 2, p.y + p.height / 2);
        ctx.restore();
      });

      // Draw Lasers
      state.lasers.forEach((l) => {
        ctx.save();
        ctx.fillStyle = '#EF4444';
        ctx.shadowColor = '#F87171';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.roundRect(l.x, l.y, l.width, l.height, 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Balls & Trails
      state.balls.forEach((ball) => {
        ctx.save();

        // Trail
        ball.trail.forEach((t, idx) => {
          ctx.globalAlpha = t.alpha * (1 - idx / ball.trail.length);
          ctx.fillStyle = ball.isFireball ? '#F97316' : '#06B6D4';
          ctx.beginPath();
          ctx.arc(t.x, t.y, ball.radius * (1 - idx * 0.08), 0, Math.PI * 2);
          ctx.fill();
        });

        // Ball Core
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = ball.isFireball ? '#F97316' : '#06B6D4';
        ctx.shadowBlur = ball.isFireball ? 25 : 18;

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Shiny Bevel
        ctx.strokeStyle = ball.isFireball ? '#FED7AA' : '#CFFAFE';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      });

      // Draw Futuristic Paddle
      const paddleY = height - 42;
      ctx.save();

      // Laser Cannon Thrusters
      if (state.isLaserActive) {
        ctx.fillStyle = '#EF4444';
        ctx.shadowColor = '#F87171';
        ctx.shadowBlur = 15;
        ctx.fillRect(state.paddleX + 8, paddleY - 6, 8, 8);
        ctx.fillRect(state.paddleX + state.paddleWidth - 16, paddleY - 6, 8, 8);
      }

      // Outer paddle glow
      ctx.shadowColor = state.isLaserActive ? '#EF4444' : '#06B6D4';
      ctx.shadowBlur = 22;

      // Paddle Body Gradient
      const paddleGrad = ctx.createLinearGradient(state.paddleX, paddleY, state.paddleX, paddleY + state.paddleHeight);
      paddleGrad.addColorStop(0, '#FFFFFF');
      paddleGrad.addColorStop(0.3, state.isLaserActive ? '#F87171' : '#38BDF8');
      paddleGrad.addColorStop(0.7, state.isLaserActive ? '#DC2626' : '#0284C7');
      paddleGrad.addColorStop(1, '#082F49');

      ctx.fillStyle = paddleGrad;
      ctx.beginPath();
      ctx.roundRect(state.paddleX, paddleY, state.paddleWidth, state.paddleHeight, 8);
      ctx.fill();

      // Top Highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Paddle Core Energy Strip
      ctx.fillStyle = state.isLaserActive ? '#FEE2E2' : '#E0F2FE';
      ctx.beginPath();
      ctx.roundRect(
        state.paddleX + state.paddleWidth * 0.25,
        paddleY + 4,
        state.paddleWidth * 0.5,
        state.paddleHeight - 8,
        3
      );
      ctx.fill();
      ctx.restore();

      // Draw Particles
      state.particles.forEach((pt) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Floating Texts
      state.floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 10;
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      ctx.restore(); // Restore camera shake

      // Hint line when ball is waiting to be launched
      if (!state.hasStarted) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = '600 13px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#06B6D4';
        ctx.shadowBlur = 10;
        ctx.fillText('TEKAN [SPASI] ATAU SENTUH LAYAR UNTUK MELUNCURKAN BOLA', width / 2, paddleY - 26);
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
    };
  }, [level, settings]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full block cursor-crosshair touch-none"
    />
  );
};
