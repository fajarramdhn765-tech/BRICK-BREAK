import { GameLevel, Brick } from '../types/game';

// Helper to create grid rows
export function createLevels(): GameLevel[] {
  const levels: GameLevel[] = [];

  // LEVEL 1: NEON GATEWAY
  {
    const bricks: Omit<Brick, 'isHit'>[] = [];
    const rows = 5;
    const cols = 9;
    const colors = [
      { fill: '#F59E0B', accent: '#FEF3C7', pts: 100 }, // Gold
      { fill: '#06B6D4', accent: '#CFFAFE', pts: 80 },  // Cyan
      { fill: '#EC4899', accent: '#FCE7F3', pts: 60 },  // Pink
      { fill: '#3B82F6', accent: '#DBEAFE', pts: 50 },  // Blue
      { fill: '#10B981', accent: '#D1FAE5', pts: 40 },  // Emerald
    ];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = `l1_r${r}_c${c}`;
        const palette = colors[r % colors.length];
        
        let powerUp = undefined;
        if (r === 2 && c === 4) powerUp = 'MULTIBALL';
        else if (r === 1 && (c === 2 || c === 6)) powerUp = 'WIDE_PADDLE';
        else if (r === 4 && (c === 0 || c === 8)) powerUp = 'SHIELD';
        else if (r === 0 && c === 4) powerUp = 'LASER';

        bricks.push({
          id,
          x: c, // Column index, converted dynamically by canvas
          y: r,
          width: 1,
          height: 1,
          hp: 1,
          maxHp: 1,
          type: 'normal',
          color: palette.fill,
          accentColor: palette.accent,
          points: palette.pts,
          powerUp: powerUp as any,
        });
      }
    }

    levels.push({
      id: 1,
      name: 'NEON GATEWAY',
      subtitle: 'Inisiasi Arena Cyber',
      difficulty: 'Mudah',
      bricks,
      targetScore: 2500,
      ballSpeed: 6.2,
      paddleWidth: 120,
    });
  }

  // LEVEL 2: CYBER PYRAMID
  {
    const bricks: Omit<Brick, 'isHit'>[] = [];
    const rows = 7;
    const cols = 11;
    const centerCol = 5;

    for (let r = 0; r < rows; r++) {
      const span = r + 1;
      const startCol = centerCol - span + 1;
      const endCol = centerCol + span - 1;

      for (let c = startCol; c <= endCol; c += 2) {
        const id = `l2_r${r}_c${c}`;
        const isCenter = c === centerCol && r === 3;
        const isPeak = r === 0 && c === centerCol;
        const isEdge = c === startCol || c === endCol;

        let type: Brick['type'] = 'normal';
        let hp = 1;
        let color = '#06B6D4';
        let accent = '#A5F3FC';
        let pts = 100;
        let powerUp = undefined;

        if (isCenter) {
          type = 'explosive';
          color = '#EF4444';
          accent = '#FEE2E2';
          pts = 300;
          powerUp = 'FIREBALL';
        } else if (isPeak) {
          type = 'gold';
          hp = 3;
          color = '#F59E0B';
          accent = '#FEF3C7';
          pts = 400;
          powerUp = 'MULTIBALL';
        } else if (isEdge) {
          type = 'silver';
          hp = 2;
          color = '#64748B';
          accent = '#E2E8F0';
          pts = 200;
        } else {
          color = r % 2 === 0 ? '#3B82F6' : '#8B5CF6';
          accent = r % 2 === 0 ? '#DBEAFE' : '#EDE9FE';
        }

        if (r === 5 && c === centerCol) powerUp = 'LASER';

        bricks.push({
          id,
          x: c,
          y: r,
          width: 1.8,
          height: 1,
          hp,
          maxHp: hp,
          type,
          color,
          accentColor: accent,
          points: pts,
          powerUp: powerUp as any,
        });
      }
    }

    levels.push({
      id: 2,
      name: 'CYBER PYRAMID',
      subtitle: 'Struktur Piramida Kuantum',
      difficulty: 'Sedang',
      bricks,
      targetScore: 4500,
      ballSpeed: 6.8,
      paddleWidth: 110,
    });
  }

  // LEVEL 3: TITAN FORTRESS
  {
    const bricks: Omit<Brick, 'isHit'>[] = [];
    const rows = 6;
    const cols = 10;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isBastion = (c < 3 || c > 6) && (r < 4);
        const isBridge = (c >= 3 && c <= 6) && (r === 1 || r === 2);
        const isTNT = (c === 1 || c === 8) && r === 2;

        if (!isBastion && !isBridge) continue;

        const id = `l3_r${r}_c${c}`;
        let type: Brick['type'] = 'normal';
        let hp = 1;
        let color = '#0284C7';
        let accent = '#BAE6FD';
        let pts = 120;
        let powerUp = undefined;

        if (isTNT) {
          type = 'explosive';
          color = '#DC2626';
          accent = '#FECACA';
          pts = 350;
          powerUp = 'MULTIBALL';
        } else if (r === 0) {
          type = 'gold';
          hp = 3;
          color = '#D97706';
          accent = '#FDE68A';
          pts = 300;
          powerUp = 'LASER';
        } else if (isBastion && (c === 0 || c === 9)) {
          type = 'silver';
          hp = 2;
          color = '#475569';
          accent = '#CBD5E1';
          pts = 200;
        }

        if (r === 3 && (c === 2 || c === 7)) powerUp = 'SHIELD';
        if (isBridge && r === 2 && c === 4) powerUp = 'EXTRA_LIFE';

        bricks.push({
          id,
          x: c,
          y: r,
          width: 1,
          height: 1,
          hp,
          maxHp: hp,
          type,
          color,
          accentColor: accent,
          points: pts,
          powerUp: powerUp as any,
        });
      }
    }

    levels.push({
      id: 3,
      name: 'TITAN FORTRESS',
      subtitle: 'Benteng Baja Berlapis',
      difficulty: 'Tantangan',
      bricks,
      targetScore: 6000,
      ballSpeed: 7.2,
      paddleWidth: 105,
    });
  }

  // LEVEL 4: PLASMA VORTEX
  {
    const bricks: Omit<Brick, 'isHit'>[] = [];
    const rows = 8;
    const cols = 10;
    const centerR = 3.5;
    const centerC = 4.5;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const dist = Math.hypot((c - centerC) * 1.1, r - centerR);
        if (dist > 3.8 || dist < 1.2) continue;

        const id = `l4_r${r}_c${c}`;
        const isCore = dist < 2.0;

        let type: Brick['type'] = 'normal';
        let hp = 1;
        let color = '#8B5CF6';
        let accent = '#DDD6FE';
        let pts = 150;
        let powerUp = undefined;

        if (isCore) {
          type = 'explosive';
          color = '#EC4899';
          accent = '#FCE7F3';
          pts = 400;
          powerUp = 'FIREBALL';
        } else if (dist > 3.0) {
          color = '#06B6D4';
          accent = '#CFFAFE';
        } else {
          color = '#F97316';
          accent = '#FFEDD5';
        }

        if (r === 1 && c === 5) powerUp = 'MULTIBALL';
        if (r === 6 && c === 4) powerUp = 'WIDE_PADDLE';

        bricks.push({
          id,
          x: c,
          y: r,
          width: 1,
          height: 1,
          hp,
          maxHp: hp,
          type,
          color,
          accentColor: accent,
          points: pts,
          powerUp: powerUp as any,
        });
      }
    }

    levels.push({
      id: 4,
      name: 'PLASMA VORTEX',
      subtitle: 'Pusaran Energi Kosmik',
      difficulty: 'Tantangan',
      bricks,
      targetScore: 7500,
      ballSpeed: 7.6,
      paddleWidth: 100,
    });
  }

  // LEVEL 5: QUANTUM MATRIX
  {
    const bricks: Omit<Brick, 'isHit'>[] = [];
    const rows = 6;
    const cols = 11;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Checkerboard weave
        const isGap = (r % 2 === 0 && c % 2 === 1) && (r > 1 && r < 5);
        if (isGap) continue;

        const id = `l5_r${r}_c${c}`;
        let type: Brick['type'] = 'normal';
        let hp = 1;
        let color = '#10B981';
        let accent = '#A7F3D0';
        let pts = 160;
        let powerUp = undefined;

        if (r === 0) {
          type = 'gold';
          hp = 3;
          color = '#F59E0B';
          accent = '#FEF3C7';
          pts = 450;
          if (c === 5) powerUp = 'MULTIBALL';
        } else if (r === 1 && (c === 2 || c === 8)) {
          type = 'silver';
          hp = 2;
          color = '#64748B';
          accent = '#F1F5F9';
        } else if (r === 3 && c === 5) {
          type = 'explosive';
          color = '#EF4444';
          pts = 500;
          powerUp = 'LASER';
        }

        if (r === 4 && (c === 1 || c === 9)) powerUp = 'SHIELD';
        if (r === 2 && c === 5) powerUp = 'SLOW_MO';

        bricks.push({
          id,
          x: c,
          y: r,
          width: 1,
          height: 1,
          hp,
          maxHp: hp,
          type,
          color,
          accentColor: accent,
          points: pts,
          powerUp: powerUp as any,
        });
      }
    }

    levels.push({
      id: 5,
      name: 'QUANTUM MATRIX',
      subtitle: 'Kisi Enkripsi Nano',
      difficulty: 'Pakar',
      bricks,
      targetScore: 9000,
      ballSpeed: 8.0,
      paddleWidth: 95,
    });
  }

  // LEVEL 6: THE CORE OVERLORD
  {
    const bricks: Omit<Brick, 'isHit'>[] = [];
    const rows = 8;
    const cols = 12;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isCore = (r >= 2 && r <= 4) && (c >= 4 && c <= 7);
        const isWings = (r <= 2) && (c <= 2 || c >= 9);
        const isOuterShield = (r === 5 || r === 6) && (c >= 2 && c <= 9);

        if (!isCore && !isWings && !isOuterShield) continue;

        const id = `l6_r${r}_c${c}`;
        let type: Brick['type'] = 'normal';
        let hp = 1;
        let color = '#06B6D4';
        let accent = '#CFFAFE';
        let pts = 200;
        let powerUp = undefined;

        if (isCore) {
          if (r === 3 && (c === 5 || c === 6)) {
            type = 'gold';
            hp = 4;
            color = '#F59E0B';
            accent = '#FEF3C7';
            pts = 800;
            powerUp = 'FIREBALL';
          } else {
            type = 'explosive';
            color = '#DC2626';
            accent = '#FEE2E2';
            pts = 600;
            powerUp = 'LASER';
          }
        } else if (isWings) {
          type = 'silver';
          hp = 2;
          color = '#8B5CF6';
          accent = '#EDE9FE';
          if (r === 0 && (c === 1 || c === 10)) powerUp = 'MULTIBALL';
        } else if (isOuterShield) {
          color = '#0284C7';
          accent = '#BAE6FD';
          if (c === 5 || c === 6) powerUp = 'EXTRA_LIFE';
        }

        bricks.push({
          id,
          x: c,
          y: r,
          width: 1,
          height: 1,
          hp,
          maxHp: hp,
          type,
          color,
          accentColor: accent,
          points: pts,
          powerUp: powerUp as any,
        });
      }
    }

    levels.push({
      id: 6,
      name: 'THE CORE OVERLORD',
      subtitle: 'Pertarungan Terakhir Arkade',
      difficulty: 'Pakar',
      bricks,
      targetScore: 12000,
      ballSpeed: 8.4,
      paddleWidth: 90,
    });
  }

  return levels;
}
