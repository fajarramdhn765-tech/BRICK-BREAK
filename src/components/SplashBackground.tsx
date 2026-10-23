import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface AttractBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  trail: { x: number; y: number; alpha: number }[];
}

export const SplashBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.targetX = (e.clientX / width - 0.5) * 40;
      mousePos.current.targetY = (e.clientY / height - 0.5) * 40;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize Attract Mode Bouncing Glowing Balls
    const attractBalls: AttractBall[] = [
      {
        x: width * 0.25,
        y: height * 0.35,
        vx: 2.8,
        vy: 2.2,
        radius: 7,
        color: '#FFFFFF',
        glowColor: '#06B6D4',
        trail: [],
      },
      {
        x: width * 0.75,
        y: height * 0.65,
        vx: -2.4,
        vy: 2.7,
        radius: 6,
        color: '#FFFFFF',
        glowColor: '#F59E0B',
        trail: [],
      },
    ];

    // Floating Stardust Particles
    const particles: Particle[] = [];
    const particleColors = ['#06B6D4', '#38BDF8', '#F59E0B', '#F97316', '#FFFFFF'];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.3 - Math.random() * 0.7,
        size: Math.random() * 2.5 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: Math.random() * 0.7 + 0.2,
        decay: Math.random() * 0.005 + 0.002,
      });
    }

    // Spark Burst Generator (idle arcade brick shattering effect)
    let nextSparkTime = performance.now() + 2000;
    const sparkParticles: Particle[] = [];

    const spawnSparkBurst = (x: number, y: number) => {
      const colors = ['#06B6D4', '#F59E0B', '#EF4444', '#10B981'];
      const burstColor = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        sparkParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1.5,
          color: burstColor,
          alpha: 1,
          decay: 0.02 + Math.random() * 0.02,
        });
      }
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      // Parallax easing
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      if (!prefersReducedMotion) {
        // Random spark bursts in perimeter
        if (time > nextSparkTime) {
          const sx = Math.random() > 0.5 ? Math.random() * (width * 0.3) : width * 0.7 + Math.random() * (width * 0.3);
          const sy = Math.random() * (height * 0.8) + height * 0.1;
          spawnSparkBurst(sx, sy);
          nextSparkTime = time + 2500 + Math.random() * 2000;
        }

        // Draw Sparks
        for (let i = sparkParticles.length - 1; i >= 0; i--) {
          const sp = sparkParticles[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.alpha -= sp.decay;

          if (sp.alpha <= 0) {
            sparkParticles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, sp.alpha);
          ctx.fillStyle = sp.color;
          ctx.shadowColor = sp.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(sp.x + mousePos.current.x * 0.5, sp.y + mousePos.current.y * 0.5, sp.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Draw and update Attract Bouncing Balls
        attractBalls.forEach((b) => {
          b.x += b.vx;
          b.y += b.vy;

          if (b.x - b.radius <= 0) {
            b.x = b.radius;
            b.vx = Math.abs(b.vx);
          } else if (b.x + b.radius >= width) {
            b.x = width - b.radius;
            b.vx = -Math.abs(b.vx);
          }

          if (b.y - b.radius <= 0) {
            b.y = b.radius;
            b.vy = Math.abs(b.vy);
          } else if (b.y + b.radius >= height) {
            b.y = height - b.radius;
            b.vy = -Math.abs(b.vy);
          }

          // Add trail
          b.trail.unshift({ x: b.x, y: b.y, alpha: 0.7 });
          if (b.trail.length > 10) b.trail.pop();

          // Render trail
          ctx.save();
          b.trail.forEach((point, idx) => {
            const trailAlpha = point.alpha * (1 - idx / b.trail.length);
            ctx.globalAlpha = trailAlpha;
            ctx.fillStyle = b.glowColor;
            ctx.beginPath();
            ctx.arc(point.x, point.y, b.radius * (1 - idx * 0.07), 0, Math.PI * 2);
            ctx.fill();
          });

          // Render Ball Core
          ctx.globalAlpha = 1;
          ctx.fillStyle = b.color;
          ctx.shadowColor = b.glowColor;
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Draw Ambient Rising Dust Particles
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.y < 0) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x + mousePos.current.x * 0.2, p.y + mousePos.current.y * 0.2, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className="absolute inset-0 w-full min-h-[100dvh] overflow-hidden pointer-events-none select-none"
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* 1. Underlying High-Res Futuristic Stadium Arena Wallpaper */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out scale-105"
        style={{
          backgroundImage: "url('/assets/arcade_bg.jpg')",
          backgroundColor: '#040914',
        }}
      />

      {/* 2. Deep Navy / Cyan Neon Color Grading Scrims */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 50% 45%, rgba(6, 182, 212, 0.18) 0%, rgba(2, 6, 23, 0.72) 55%, rgba(2, 6, 23, 0.94) 100%),
            linear-gradient(180deg, rgba(3, 7, 18, 0.65) 0%, rgba(2, 6, 23, 0.4) 40%, rgba(2, 6, 23, 0.88) 100%)
          `,
        }}
      />

      {/* 3. Subtle Cyber Energy Grid Overlay */}
      <div className="absolute inset-0 w-full h-full energy-grid opacity-35" />

      {/* 4. Canvas Particle & Attract Ball Layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block" 
      />

      {/* 5. Edge Vignette for maximum text readability and cinematic arcade focus */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(2,6,23,0.95)]" />
    </div>
  );
};
