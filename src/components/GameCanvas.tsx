/**
 * Game Canvas Component
 * Renders 2D top-down school exploration with dynamic flashlight cone,
 * Lensa Nalar conceptual layer, collision geometry, and ghost entity.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PlayerState, RoomDef, InteractiveObject } from '../types/game';
import { sounds } from '../utils/sound';

interface GameCanvasProps {
  playerState: PlayerState;
  room: RoomDef;
  onUpdatePlayer: (updates: Partial<PlayerState>) => void;
  onInteractWithObject: (obj: InteractiveObject) => void;
  nearbyObject: InteractiveObject | null;
  setNearbyObject: (obj: InteractiveObject | null) => void;
  onGhostCatchesPlayer: () => void;
  onPlayerTakeDamage?: (source: string) => void;
  onGhostProximityChange?: (isNear: boolean, distance: number, proximityRatio?: number) => void;
  jumpTrigger?: number;
  isPaused?: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  playerState,
  room,
  onUpdatePlayer,
  onInteractWithObject,
  nearbyObject,
  setNearbyObject,
  onGhostCatchesPlayer,
  onPlayerTakeDamage,
  onGhostProximityChange,
  jumpTrigger,
  isPaused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 350, y: 210 });
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});
  const lastDamageTimeRef = useRef<number>(0);
  const heartbeatTimerRef = useRef<number>(0);

  // Dynamic Ghost AI & Appearance State
  const ghostStateRef = useRef<{
    x: number;
    y: number;
    patrolAngle: number;
    twitchX: number;
    twitchY: number;
    lastTwitch: number;
    lastRoomId: number;
    eyeTrail: Array<{ x: number; y: number; alpha: number }>;
  }>({
    x: 0,
    y: 0,
    patrolAngle: 0,
    twitchX: 0,
    twitchY: 0,
    lastTwitch: 0,
    lastRoomId: -1,
    eyeTrail: [],
  });

  // Horror Atmospheric Dust Particles
  const particlesRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; pulse: number }>
  >([]);
  useEffect(() => {
    if (particlesRef.current.length === 0) {
      const list = [];
      for (let i = 0; i < 22; i++) {
        list.push({
          x: Math.random() * 700,
          y: Math.random() * 420,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.22,
          size: Math.random() * 2.2 + 1.2,
          alpha: Math.random() * 0.35 + 0.12,
          pulse: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = list;
    }
  }, []);

  // Fluorescent Ceiling Tube Flicker State
  const flickerRef = useRef<{ isDark: boolean; nextFlicker: number; duration: number }>({
    isDark: false,
    nextFlicker: Date.now() + 3500,
    duration: 0,
  });

  // Jump mechanic state & physics
  const jumpOffsetRef = useRef<number>(0);
  const jumpVelocityRef = useRef<number>(0);
  const isJumpingRef = useRef<boolean>(false);
  const [jumpTick, setJumpTick] = useState<number>(0);

  const performJump = useCallback(() => {
    if (isJumpingRef.current) return;
    isJumpingRef.current = true;
    jumpVelocityRef.current = 6.4;
    jumpOffsetRef.current = 1;
    sounds.playJump();
  }, []);

  // Listen to on-screen jump trigger button
  useEffect(() => {
    if (jumpTrigger && jumpTrigger > 0) {
      performJump();
    }
  }, [jumpTrigger, performJump]);

  // Check collision against walls and boundaries
  const canMoveTo = useCallback((x: number, y: number): boolean => {
    const playerRadius = 14;
    // Bounds check
    if (x - playerRadius < 40 || x + playerRadius > room.bounds.width - 40) return false;
    if (y - playerRadius < 40 || y + playerRadius > room.bounds.height - 40) return false;

    // Room wall obstacles
    for (const wall of room.walls) {
      if (
        x + playerRadius > wall.x &&
        x - playerRadius < wall.x + wall.width &&
        y + playerRadius > wall.y &&
        y - playerRadius < wall.y + wall.height
      ) {
        return false;
      }
    }
    return true;
  }, [room]);

  // Track mouse coordinates for flashlight pointing
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mousePosRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keys if typing in modal or text input
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      keysPressedRef.current[e.key.toLowerCase()] = true;

      // Single triggers
      if (e.code === 'Space' || e.key === ' ' || e.key.toLowerCase() === 'space') {
        e.preventDefault();
        performJump();
      }
      if (e.key === 'Shift') {
        onUpdatePlayer({ lensaNalarActive: true });
        sounds.setLensaNalarHum(true);
      }
      if (e.key.toLowerCase() === 'f') {
        sounds.playFlashlight();
        onUpdatePlayer({ flashlightOn: !playerState.flashlightOn });
      }
      if (e.key.toLowerCase() === 'e' && nearbyObject) {
        onInteractWithObject(nearbyObject);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key.toLowerCase()] = false;
      if (e.key === 'Shift') {
        onUpdatePlayer({ lensaNalarActive: false });
        sounds.setLensaNalarHum(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      sounds.setLensaNalarHum(false);
    };
  }, [playerState.flashlightOn, nearbyObject, onInteractWithObject, onUpdatePlayer, performJump]);

  // Main Game Loop (Movement & Proximity)
  useEffect(() => {
    let animationFrameId: number;
    let stepSoundTimer = 0;

    const gameLoop = () => {
      if (isPaused || playerState.focus <= 0) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      // Update jump physics
      if (isJumpingRef.current) {
        jumpOffsetRef.current += jumpVelocityRef.current;
        jumpVelocityRef.current -= 0.38; // gravity
        if (jumpOffsetRef.current <= 0) {
          jumpOffsetRef.current = 0;
          jumpVelocityRef.current = 0;
          isJumpingRef.current = false;
          sounds.playFootstep();
        }
        setJumpTick((t) => (t + 1) % 10000);
      }

      const keys = keysPressedRef.current;
      let dx = 0;
      let dy = 0;
      const speed = playerState.lensaNalarActive ? 1.6 : 2.6; // Cannot run while using Lensa Nalar (GDD rule)

      if (keys['w'] || keys['arrowup']) dy -= speed;
      if (keys['s'] || keys['arrowdown']) dy += speed;
      if (keys['a'] || keys['arrowleft']) dx -= speed;
      if (keys['d'] || keys['arrowright']) dx += speed;

      // Normalize diagonal speed
      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      if (dx !== 0 || dy !== 0) {
        let newX = playerState.x + dx;
        let newY = playerState.y + dy;

        // Try sliding along axes
        if (!canMoveTo(newX, playerState.y)) newX = playerState.x;
        if (!canMoveTo(playerState.x, newY)) newY = playerState.y;

        if (newX !== playerState.x || newY !== playerState.y) {
          let dir: 'up' | 'down' | 'left' | 'right' = playerState.direction;
          if (Math.abs(dx) > Math.abs(dy)) {
            dir = dx > 0 ? 'right' : 'left';
          } else {
            dir = dy > 0 ? 'down' : 'up';
          }
          onUpdatePlayer({ x: newX, y: newY, direction: dir, isMoving: true });

          stepSoundTimer++;
          if (stepSoundTimer > 18) {
            sounds.playFootstep();
            stepSoundTimer = 0;
          }
        }
      } else {
        if (playerState.isMoving) {
          onUpdatePlayer({ isMoving: false });
        }
      }

      // Check nearby interactive objects
      let foundNear: InteractiveObject | null = null;
      for (const obj of room.objects) {
        const dist = Math.hypot(playerState.x - (obj.x + obj.width / 2), playerState.y - (obj.y + obj.height / 2));
        if (dist < 46) {
          foundNear = obj;
          break;
        }
      }
      setNearbyObject(foundNear);

      // Check proximity to Ghost (Movement AI, Damage + Horror Warning)
      if (room.ghost && !room.ghost.isDissolved) {
        const g = room.ghost;
        const gs = ghostStateRef.current;
        const now = Date.now();

        // Initialize ghost position when entering a new room
        if (gs.lastRoomId !== room.id) {
          gs.x = g.x;
          gs.y = g.y;
          gs.patrolAngle = 0;
          gs.twitchX = 0;
          gs.twitchY = 0;
          gs.lastTwitch = now;
          gs.lastRoomId = room.id;
          gs.eyeTrail = [];
        }

        // Distance to player
        const directDist = Math.hypot(playerState.x - gs.x, playerState.y - gs.y);

        // Random horror supernatural jitter/twitch (every 600-1000ms)
        if (now - gs.lastTwitch > 700) {
          gs.lastTwitch = now;
          if (Math.random() < 0.65) {
            gs.twitchX = (Math.random() - 0.5) * 8;
            gs.twitchY = (Math.random() - 0.5) * 8;
          } else {
            gs.twitchX = 0;
            gs.twitchY = 0;
          }
        }

        // Ghost Movement AI:
        // When Nara is within detection radius (< 220px), the ghost creeps toward her!
        if (directDist < 220) {
          const angle = Math.atan2(playerState.y - gs.y, playerState.x - gs.x);
          // Stalking speed scales with missteps taken
          const stalkSpeed = 0.55 + g.steps * 0.28;
          gs.x += Math.cos(angle) * stalkSpeed;
          gs.y += Math.sin(angle) * stalkSpeed;
        } else {
          // Sinister hovering patrol around base point
          gs.patrolAngle += 0.022;
          const baseTargetX = g.x - g.steps * 60;
          const baseTargetY = g.y;
          const targetX = baseTargetX + Math.cos(gs.patrolAngle) * 45;
          const targetY = baseTargetY + Math.sin(gs.patrolAngle * 1.7) * 24;
          gs.x += (targetX - gs.x) * 0.035;
          gs.y += (targetY - gs.y) * 0.035;
        }

        // Lab bounds clamp so ghost stays within room
        gs.x = Math.max(55, Math.min(room.bounds.width - 55, gs.x));
        gs.y = Math.max(55, Math.min(room.bounds.height - 55, gs.y));

        // Floating bob and twitch
        const floatBob = Math.sin(now / 320) * 8;
        const currentGhostX = gs.x + gs.twitchX;
        const currentGhostY = gs.y + floatBob + gs.twitchY;
        const ghostDist = Math.hypot(playerState.x - currentGhostX, playerState.y - currentGhostY);

        // Ghost eye-trail motion blur records
        if (Math.random() < 0.35) {
          gs.eyeTrail.unshift({ x: currentGhostX, y: currentGhostY, alpha: 0.75 });
          if (gs.eyeTrail.length > 7) gs.eyeTrail.pop();
        }
        for (let i = 0; i < gs.eyeTrail.length; i++) {
          gs.eyeTrail[i].alpha *= 0.86;
        }

        // Progressive proximity ratio from 0.0 to 1.0
        // Near when < 220px, maximum red terror when < 45px
        const isNear = ghostDist < 200;
        const proximityRatio = Math.max(0, Math.min(1, (220 - ghostDist) / 185));

        if (onGhostProximityChange) {
          onGhostProximityChange(isNear, ghostDist, proximityRatio);
        }

        // Heartbeat sound: beats faster and more intensely as Nara gets closer
        if (isNear) {
          heartbeatTimerRef.current++;
          const interval = Math.max(16, Math.floor(18 + (ghostDist / 200) * 44));
          if (heartbeatTimerRef.current >= interval) {
            sounds.playHeartbeat();
            heartbeatTimerRef.current = 0;
          }
        }

        // Damage trigger (< 50px)
        if (ghostDist < 50 && now - lastDamageTimeRef.current > 1400) {
          lastDamageTimeRef.current = now;
          sounds.playPlayerHurt();

          // Knockback player away from ghost
          const angle = Math.atan2(playerState.y - currentGhostY, playerState.x - currentGhostX);
          const pushDist = 52;
          let knockX = playerState.x + Math.cos(angle) * pushDist;
          let knockY = playerState.y + Math.sin(angle) * pushDist;

          // Boundary clamp
          knockX = Math.max(45, Math.min(room.bounds.width - 45, knockX));
          knockY = Math.max(45, Math.min(room.bounds.height - 45, knockY));

          if (canMoveTo(knockX, knockY)) {
            onUpdatePlayer({ x: knockX, y: knockY });
          }

          if (onPlayerTakeDamage) {
            onPlayerTakeDamage(g.name);
          }
        }
      } else {
        if (onGhostProximityChange) {
          onGhostProximityChange(false, 999, 0);
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [playerState.x, playerState.y, playerState.direction, playerState.isMoving, playerState.lensaNalarActive, playerState.focus, isPaused, room, canMoveTo, onUpdatePlayer, setNearbyObject, onGhostProximityChange, onPlayerTakeDamage]);

  // Canvas 2D Rendering with Dynamic Flashlight & Lensa Nalar
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Clear background (Horror dark lab floor)
    ctx.fillStyle = '#080d19';
    ctx.fillRect(0, 0, width, height);

    // School Ceramic Tile Grid with grunge wear
    ctx.strokeStyle = '#0e1726';
    ctx.lineWidth = 1;
    const tileSize = 32;
    for (let x = 0; x < width; x += tileSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += tileSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Floor stains, scratches and dark fluid puddles
    ctx.save();
    ctx.fillStyle = 'rgba(100, 12, 24, 0.32)';
    ctx.beginPath();
    ctx.ellipse(150, 190, 32, 16, 0.25, 0, Math.PI * 2);
    ctx.ellipse(470, 270, 42, 18, -0.35, 0, Math.PI * 2);
    ctx.ellipse(310, 120, 24, 11, 0.45, 0, Math.PI * 2);
    ctx.fill();

    // Floor scratch marks
    ctx.strokeStyle = 'rgba(70, 10, 18, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(140, 180);
    ctx.lineTo(165, 205);
    ctx.moveTo(146, 180);
    ctx.lineTo(172, 204);
    ctx.moveTo(460, 260);
    ctx.lineTo(490, 280);
    ctx.stroke();
    ctx.restore();

    // Wall Horror Graffiti
    const wallGraffiti: { [roomId: number]: string } = {
      0: 'ERROR 404: PINTU GERBANG TERKUNCI DARI LUAR...',
      1: 'TAG TIDAK DITUTUP... STRUKTUR BOCOR',
      2: 'IF LOGIKA SALAH == FOKUS HABIS!',
      3: 'SELECT * FROM SOUL WHERE DEAD=1',
      4: 'INDEX OUT OF BOUNDS... ARRAY DIMULAI DARI 0',
      5: 'JANGAN COBA LAWAN GALAT TANPA LOGIKA',
    };
    const graffitiText = wallGraffiti[room.id] || 'SISTEM LAB GAGAL TOTAL';
    ctx.save();
    ctx.fillStyle = 'rgba(220, 38, 38, 0.4)';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(`[!] ${graffitiText}`, 55, 28);
    ctx.restore();

    // Ambient floating dust particles
    ctx.save();
    for (const p of particlesRef.current) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.03;
      if (p.x < 40) p.x = width - 45;
      if (p.x > width - 40) p.x = 45;
      if (p.y < 40) p.y = height - 45;
      if (p.y > height - 40) p.y = 45;

      ctx.fillStyle = `rgba(180, 210, 240, ${p.alpha * (0.6 + Math.sin(p.pulse) * 0.4)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 2. Draw Walls
    ctx.fillStyle = '#070b18';
    for (const wall of room.walls) {
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
      ctx.strokeStyle = '#1b2640';
      ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
    }

    // 3. Draw Room Interactive Objects
    for (const obj of room.objects) {
      ctx.save();

      if (obj.type === 'door') {
        const isBackDoor = obj.id.includes('back');
        const roomPuzzles = room.objects.filter((o) => o.type === 'puzzle');
        const solvedCount = roomPuzzles.filter((p) => p.solved).length;
        const totalCount = roomPuzzles.length;
        const isUnlocked = totalCount === 0 || solvedCount === totalCount;

        ctx.fillStyle = '#2f3b52';
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);

        if (isBackDoor) {
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 2;
          ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
          ctx.fillStyle = '#cbd5e1';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText('⬅ KEMBALI', obj.x + 2, obj.y + obj.height / 2);
        } else {
          // Forward / Exit door
          if (isUnlocked) {
            ctx.strokeStyle = '#5FE1B0';
            ctx.lineWidth = 3;
            ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
            ctx.fillStyle = '#5FE1B0';
            ctx.font = 'bold 9px sans-serif';
            ctx.fillText('🔓 TERBUKA', obj.x + 2, obj.y + obj.height / 2 - 6);
            ctx.fillStyle = '#EDE6D6';
            ctx.font = 'bold 8px sans-serif';
            ctx.fillText('▶ LANJUT', obj.x + 3, obj.y + obj.height / 2 + 8);
          } else {
            ctx.strokeStyle = '#E85D75';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
            ctx.fillStyle = '#E85D75';
            ctx.font = 'bold 8px sans-serif';
            ctx.fillText('🔒 KUNCI', obj.x + 2, obj.y + obj.height / 2 - 6);
            ctx.fillStyle = '#fca5a5';
            ctx.font = 'bold 8px sans-serif';
            ctx.fillText(`${solvedCount}/${totalCount}`, obj.x + 6, obj.y + obj.height / 2 + 8);
          }
        }
      } else if (obj.type === 'journal') {
        // Glowing notebook
        ctx.fillStyle = '#854d0e';
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(obj.x + 4, obj.y + 4, obj.width - 8, obj.height - 8);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('JURNAL', obj.x + 2, obj.y + 18);
      } else if (obj.type === 'battery') {
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(obj.x + 6, obj.y - 4, obj.width - 12, 4);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText('⚡AA', obj.x + 2, obj.y + 14);
      } else if (obj.type === 'bip_terminal') {
        // CRT monitor
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(obj.x + 4, obj.y + 4, obj.width - 8, obj.height - 12);
        ctx.fillStyle = '#5FE1B0';
        ctx.font = '9px monospace';
        ctx.fillText('[◉_◉]', obj.x + 8, obj.y + 20);
      } else {
        // Lab benches / Puzzles
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
        ctx.fillStyle = '#EDE6D6';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(obj.label.slice(0, 14), obj.x + 4, obj.y + 16);
      }

      // Proximity Glow Ring
      if (nearbyObject && nearbyObject.id === obj.id) {
        ctx.strokeStyle = '#F2C14E';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 2]);
        ctx.strokeRect(obj.x - 4, obj.y - 4, obj.width + 8, obj.height + 8);
        ctx.setLineDash([]);
      }

      ctx.restore();
    }

    // 4. Draw Ghost (if present and not dissolved)
    if (room.ghost && !room.ghost.isDissolved) {
      const g = room.ghost;
      const gs = ghostStateRef.current;
      const now = Date.now();
      const floatBob = Math.sin(now / 320) * 8;
      const currentGhostX = gs.x + gs.twitchX;
      const currentGhostY = gs.y + floatBob + gs.twitchY;
      const dist = Math.hypot(playerState.x - currentGhostX, playerState.y - currentGhostY);

      ctx.save();

      // 4.1 Eye trail / phantom motion blur
      for (const trail of gs.eyeTrail) {
        ctx.fillStyle = `rgba(225, 29, 72, ${trail.alpha * 0.28})`;
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, 22, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4.2 Pulsing blood-shadow aura at the base
      const auraPulse = Math.sin(now / 180) * 6;
      const auraSize = 38 + auraPulse;
      const gGrad = ctx.createRadialGradient(
        currentGhostX, currentGhostY, 4,
        currentGhostX, currentGhostY, auraSize
      );
      gGrad.addColorStop(0, 'rgba(180, 0, 30, 0.95)');
      gGrad.addColorStop(0.5, 'rgba(120, 0, 20, 0.55)');
      gGrad.addColorStop(0.85, 'rgba(30, 0, 10, 0.2)');
      gGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gGrad;
      ctx.beginPath();
      ctx.arc(currentGhostX, currentGhostY, auraSize, 0, Math.PI * 2);
      ctx.fill();

      // 4.3 Shredded ragged phantom shroud / cowl
      ctx.fillStyle = '#0f0507';
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(currentGhostX - 16, currentGhostY - 14);
      ctx.quadraticCurveTo(currentGhostX, currentGhostY - 26, currentGhostX + 16, currentGhostY - 14);
      ctx.lineTo(currentGhostX + 20, currentGhostY + 18);
      // Jagged ripped cloth hem
      const ripCount = 6;
      for (let i = 0; i < ripCount; i++) {
        const rx = (currentGhostX + 20) - (i * (40 / ripCount));
        const ry = currentGhostY + 18 + ((i % 2 === 0) ? 6 : -4) + Math.sin((now / 140) + i) * 3;
        ctx.lineTo(rx, ry);
      }
      ctx.lineTo(currentGhostX - 20, currentGhostY + 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 4.4 Spectral reaching claws / shadow hands
      const armReach = Math.min(18, (1 - Math.min(1, dist / 200)) * 18);
      const armBob = Math.cos(now / 240) * 3;
      // Left reaching claw
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(currentGhostX - 14, currentGhostY);
      ctx.quadraticCurveTo(currentGhostX - 24 - armReach, currentGhostY + armBob, currentGhostX - 28 - armReach, currentGhostY + 6 + armBob);
      ctx.lineTo(currentGhostX - 32 - armReach, currentGhostY + 3 + armBob);
      ctx.moveTo(currentGhostX - 28 - armReach, currentGhostY + 6 + armBob);
      ctx.lineTo(currentGhostX - 32 - armReach, currentGhostY + 9 + armBob);
      ctx.stroke();

      // Right reaching claw
      ctx.beginPath();
      ctx.moveTo(currentGhostX + 14, currentGhostY);
      ctx.quadraticCurveTo(currentGhostX + 24 + armReach, currentGhostY - armBob, currentGhostX + 28 + armReach, currentGhostY + 6 - armBob);
      ctx.lineTo(currentGhostX + 32 + armReach, currentGhostY + 3 - armBob);
      ctx.moveTo(currentGhostX + 28 + armReach, currentGhostY + 6 - armBob);
      ctx.lineTo(currentGhostX + 32 + armReach, currentGhostY + 9 - armBob);
      ctx.stroke();

      // 4.5 Hollow face socket & Demonic Glowing Eyes
      ctx.fillStyle = '#050102';
      ctx.beginPath();
      ctx.ellipse(currentGhostX, currentGhostY - 10, 10, 13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bleeding Crimson Eyes
      const eyePulse = Math.sin(now / 110) * 0.8;
      const eyeGlowL = ctx.createRadialGradient(
        currentGhostX - 4.5, currentGhostY - 11, 1,
        currentGhostX - 4.5, currentGhostY - 11, 7
      );
      eyeGlowL.addColorStop(0, '#ffffff');
      eyeGlowL.addColorStop(0.3, '#ff1a40');
      eyeGlowL.addColorStop(1, 'rgba(255, 0, 40, 0)');
      ctx.fillStyle = eyeGlowL;
      ctx.beginPath();
      ctx.arc(currentGhostX - 4.5, currentGhostY - 11, 3.5 + eyePulse, 0, Math.PI * 2);
      ctx.fill();

      const eyeGlowR = ctx.createRadialGradient(
        currentGhostX + 4.5, currentGhostY - 11, 1,
        currentGhostX + 4.5, currentGhostY - 11, 7
      );
      eyeGlowR.addColorStop(0, '#ffffff');
      eyeGlowR.addColorStop(0.3, '#ff1a40');
      eyeGlowR.addColorStop(1, 'rgba(255, 0, 40, 0)');
      ctx.fillStyle = eyeGlowR;
      ctx.beginPath();
      ctx.arc(currentGhostX + 4.5, currentGhostY - 11, 3.5 + eyePulse, 0, Math.PI * 2);
      ctx.fill();

      // Eye pupil slits
      ctx.fillStyle = '#000000';
      ctx.fillRect(currentGhostX - 5.2, currentGhostY - 12.5, 1.4, 3);
      ctx.fillRect(currentGhostX + 3.8, currentGhostY - 12.5, 1.4, 3);

      // 4.6 Floating Corrupted Code Glitches
      const glitchWords = ['NULL', '0x00', 'NaN', 'ERR_404', 'VOID', 'DEAD_PTR'];
      ctx.font = '8px monospace';
      ctx.fillStyle = 'rgba(244, 63, 94, 0.75)';
      for (let i = 0; i < 3; i++) {
        const angle = (now / 550) + (i * (Math.PI * 2 / 3));
        const gx = currentGhostX + Math.cos(angle) * (26 + i * 4);
        const gy = currentGhostY + Math.sin(angle) * (20 + i * 3);
        ctx.fillText(glitchWords[(g.steps + i) % glitchWords.length], gx - 12, gy);
      }

      // 4.7 Ghost Name Tag & Steps Threat Meter
      ctx.fillStyle = '#ff3366';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#ff0033';
      ctx.shadowBlur = 6;
      ctx.fillText(`☠ ${g.name}`, currentGhostX, currentGhostY - 32);
      ctx.shadowBlur = 0;

      // Misstep threat indicators (3 red pips)
      for (let s = 0; s < 3; s++) {
        ctx.fillStyle = s < g.steps ? '#ef4444' : '#475569';
        ctx.beginPath();
        ctx.arc(currentGhostX - 10 + s * 10, currentGhostY - 24, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // 5. Draw Nara (Player - Siswi SMK RPL)
    const isInvulnerable = Date.now() - lastDamageTimeRef.current < 1400;
    const shouldFlicker = isInvulnerable && Math.floor(Date.now() / 100) % 2 === 0;

    const jumpOffset = jumpOffsetRef.current;
    const isAirborne = jumpOffset > 0;
    const renderY = playerState.y - jumpOffset;
    const walkCycle = playerState.isMoving ? Math.sin(Date.now() / 110) : 0;
    const dir = playerState.direction;

    if (!shouldFlicker) {
      ctx.save();

      // 5.1 Dynamic Ground Shadow (contracts as Nara jumps)
      const shadowScale = Math.max(0.35, 1 - (jumpOffset / 42));
      ctx.fillStyle = `rgba(0, 0, 0, ${0.4 * shadowScale})`;
      ctx.beginPath();
      ctx.ellipse(playerState.x, playerState.y + 13, 11 * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // If hurt recently, flash with red tint & glow
      if (isInvulnerable) {
        ctx.shadowColor = '#E85D75';
        ctx.shadowBlur = 14;
      }

      // 5.2 Tas Ransel Sekolah (Backpack Anak SMK)
      const drawBackpack = () => {
        ctx.fillStyle = '#0F172A'; // Dark navy school backpack
        if (dir === 'up') {
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(playerState.x - 7, renderY - 8, 14, 12, 3) : ctx.fillRect(playerState.x - 7, renderY - 8, 14, 12);
          ctx.fill();
          // Reflective strip / zipper
          ctx.fillStyle = '#5FE1B0';
          ctx.fillRect(playerState.x - 4, renderY - 3, 8, 1.8);
        } else if (dir === 'left') {
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(playerState.x + 3, renderY - 8, 5, 11, 2) : ctx.fillRect(playerState.x + 3, renderY - 8, 5, 11);
          ctx.fill();
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(playerState.x + 5, renderY - 4, 1.8, 3.5);
        } else if (dir === 'right') {
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(playerState.x - 8, renderY - 8, 5, 11, 2) : ctx.fillRect(playerState.x - 8, renderY - 8, 5, 11);
          ctx.fill();
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(playerState.x - 6.8, renderY - 4, 1.8, 3.5);
        }
      };

      // If not facing up, draw backpack behind torso
      if (dir !== 'up') {
        drawBackpack();
      }

      // 5.3 Kaki, Kaus Kaki Putih & Sepatu Kets Sekolah (Sneakers Hitam-Putih Siswi SMK)
      const legOffset = isAirborne ? -2.5 : 0;
      const leftFootY = renderY + 11 + legOffset + (dir === 'up' || dir === 'down' ? walkCycle * 2.5 : 0);
      const rightFootY = renderY + 11 + legOffset - (dir === 'up' || dir === 'down' ? walkCycle * 2.5 : 0);

      // Kaus kaki putih sekolah
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(playerState.x - 5, leftFootY - 3, 3.5, 3.5);
      ctx.fillRect(playerState.x + 1.5, rightFootY - 3, 3.5, 3.5);

      // Sepatu kets sekolah (Black canvas body + white rubber sole & toe)
      // Kaki kiri
      ctx.fillStyle = '#111827';
      ctx.fillRect(playerState.x - 5.5, leftFootY, 4, 3);
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(playerState.x - 5.5, leftFootY + 2.2, 4, 1.2);
      if (dir === 'left') {
        ctx.fillRect(playerState.x - 6.5, leftFootY + 0.8, 1.5, 2.2);
      }

      // Kaki kanan
      ctx.fillStyle = '#111827';
      ctx.fillRect(playerState.x + 1.5, rightFootY, 4, 3);
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(playerState.x + 1.5, rightFootY + 2.2, 4, 1.2);
      if (dir === 'right') {
        ctx.fillRect(playerState.x + 4.5, rightFootY + 0.8, 1.5, 2.2);
      }

      // 5.4 Rok Abu-Abu SMK Khas (Pleated Gray Skirt - Seragam Nasional SMA/SMK)
      const skirtFlare = isAirborne ? 1.5 : (playerState.isMoving ? Math.abs(walkCycle) * 0.8 : 0);
      ctx.fillStyle = isInvulnerable ? '#DC2626' : '#475569'; // Abu-abu seragam SMK
      ctx.beginPath();
      ctx.moveTo(playerState.x - 6.5, renderY + 2);
      ctx.lineTo(playerState.x + 6.5, renderY + 2);
      ctx.lineTo(playerState.x + 8 + skirtFlare, renderY + 9 + legOffset);
      ctx.lineTo(playerState.x - 8 - skirtFlare, renderY + 9 + legOffset);
      ctx.closePath();
      ctx.fill();

      // Skirt pleat lines (Lipit rempel rok abu-abu)
      ctx.strokeStyle = isInvulnerable ? '#991B1B' : '#334155';
      ctx.lineWidth = 1;
      [-3.5, 0, 3.5].forEach((pX) => {
        ctx.beginPath();
        ctx.moveTo(playerState.x + pX, renderY + 2);
        ctx.lineTo(playerState.x + pX * 1.3, renderY + 9 + legOffset);
        ctx.stroke();
      });

      // Sabuk hitam sekolah & gesper perak (School Belt & Buckle)
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(playerState.x - 6.5, renderY + 1, 13, 2);
      if (dir !== 'up') {
        ctx.fillStyle = '#CBD5E1'; // Gesper logam
        ctx.fillRect(playerState.x - 1.2, renderY + 1, 2.4, 2);
      }

      // 5.5 Kemeja Putih Seragam SMK (White School Shirt)
      ctx.fillStyle = isInvulnerable ? '#FCA5A5' : '#FFFFFF';
      ctx.fillRect(playerState.x - 6.5, renderY - 7, 13, 8.5);

      // Shading sisi kemeja
      ctx.fillStyle = isInvulnerable ? '#EF4444' : '#E2E8F0';
      ctx.fillRect(playerState.x - 6.5, renderY - 7, 1.5, 8.5);
      ctx.fillRect(playerState.x + 5, renderY - 7, 1.5, 8.5);

      if (dir === 'up') {
        // Draw backpack on back
        drawBackpack();
      } else {
        // Kerah Kemeja Putih (Shirt Collar)
        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.moveTo(playerState.x - 3.5, renderY - 7);
        ctx.lineTo(playerState.x, renderY - 4.5);
        ctx.lineTo(playerState.x + 3.5, renderY - 7);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Tali Lanyard Pelajar SMK (Green Toska Lanyard & ID Card)
        ctx.strokeStyle = '#0D9488';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(playerState.x - 2, renderY - 6.5);
        ctx.lineTo(playerState.x - 0.5, renderY - 2.5);
        ctx.stroke();
        // ID Card
        ctx.fillStyle = '#F1F5F9';
        ctx.fillRect(playerState.x - 1.8, renderY - 2.5, 3.2, 4);
        ctx.fillStyle = '#0284C7';
        ctx.fillRect(playerState.x - 1.2, renderY - 2, 2, 1.5);

        // Saku kemeja dengan Badge OSIS/SMK Bordir (dada kiri)
        if (dir !== 'right') {
          ctx.fillStyle = '#F1F5F9';
          ctx.fillRect(playerState.x - 5.5, renderY - 4.5, 3, 3);
          // Lambang OSIS: Titik biru & emas
          ctx.fillStyle = '#1D4ED8';
          ctx.fillRect(playerState.x - 5, renderY - 4, 2, 1.2);
          ctx.fillStyle = '#F59E0B';
          ctx.fillRect(playerState.x - 5, renderY - 2.8, 2, 0.8);
        }

        // Papan nama siswa bordir (dada kanan)
        if (dir !== 'left') {
          ctx.fillStyle = '#1E293B';
          ctx.fillRect(playerState.x + 2, renderY - 4, 3, 1);
        }
      }

      // Tali ransel di pundak depan (Backpack shoulder straps)
      if (dir !== 'up') {
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(playerState.x - 6, renderY - 6.5, 1.8, 7);
        ctx.fillRect(playerState.x + 4.2, renderY - 6.5, 1.8, 7);
      }

      // 5.6 Lengan & Tangan (dengan Smartphone Lensa Nalar)
      const armBob = isAirborne ? -2 : walkCycle * 1.5;
      ctx.fillStyle = isInvulnerable ? '#FCA5A5' : '#FFFFFF'; // Lengan pendek kemeja
      ctx.fillRect(playerState.x - 8, renderY - 7 + armBob, 2.2, 4.5);
      ctx.fillRect(playerState.x + 5.8, renderY - 7 - armBob, 2.2, 4.5);

      // Kulit tangan sawo matang cerah
      ctx.fillStyle = isInvulnerable ? '#FCA5A5' : '#F5D0A9';
      ctx.fillRect(playerState.x - 8, renderY - 2.5 + armBob, 2.2, 2.5);
      ctx.fillRect(playerState.x + 5.8, renderY - 2.5 - armBob, 2.2, 2.5);

      // Smartphone Lensa Nalar di tangan Nara
      const phoneX = dir === 'left' ? playerState.x - 10 : (dir === 'right' ? playerState.x + 6.5 : playerState.x + 4.5);
      const phoneY = renderY - 2 + (isAirborne ? -2 : 0);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(phoneX, phoneY, 4, 6.5);
      // Phone glowing screen (Toska Lensa Nalar)
      ctx.fillStyle = playerState.lensaNalarActive ? '#5FE1B0' : (playerState.flashlightOn ? '#F2C14E' : '#38BDF8');
      ctx.fillRect(phoneX + 0.8, phoneY + 0.8, 2.4, 4.8);
      // Screen glow
      ctx.fillStyle = playerState.lensaNalarActive ? 'rgba(95, 225, 176, 0.4)' : 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.arc(phoneX + 2, phoneY + 3, 5, 0, Math.PI * 2);
      ctx.fill();

      // 5.7 Kepala & Wajah Siswi SMK Nara
      const headY = renderY - 11;
      // Leher
      ctx.fillStyle = isInvulnerable ? '#FCA5A5' : '#F5D0A9';
      ctx.fillRect(playerState.x - 2, headY + 3, 4, 3);

      // Wajah oval sawo matang cerah
      ctx.beginPath();
      ctx.arc(playerState.x, headY, 7.5, 0, Math.PI * 2);
      ctx.fill();

      if (dir !== 'up') {
        // Rona pipi manis (Subtle blush)
        ctx.fillStyle = 'rgba(244, 114, 182, 0.55)';
        ctx.beginPath();
        ctx.arc(playerState.x - 4.2, headY + 2, 1.8, 0, Math.PI * 2);
        ctx.arc(playerState.x + 4.2, headY + 2, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Mata anime ekspresif
        ctx.fillStyle = '#0F172A';
        const eyeOffsetX = dir === 'left' ? -2.5 : (dir === 'right' ? 2.5 : 0);
        const leftEyeX = playerState.x - 3 + eyeOffsetX;
        const rightEyeX = playerState.x + 3 + eyeOffsetX;

        if (dir !== 'right') {
          ctx.fillRect(leftEyeX - 1, headY - 1, 2.2, 2.8);
          // Catchlight mata putih
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(leftEyeX - 0.5, headY - 1, 1, 1.2);
        }
        if (dir !== 'left') {
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(rightEyeX - 1, headY - 1, 2.2, 2.8);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(rightEyeX - 0.5, headY - 1, 1, 1.2);
        }

        // Senyum tipis / ekspresi fokus
        ctx.strokeStyle = '#B45309';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(playerState.x + eyeOffsetX * 0.4, headY + 2.8, 1.5, 0.1, Math.PI - 0.1);
        ctx.stroke();
      }

      // 5.8 Rambut Hitam & Poni Siswi SMK
      ctx.fillStyle = '#181824'; // Rambut hitam berkilau
      ctx.beginPath();
      ctx.arc(playerState.x, headY - 1.5, 7.8, Math.PI * 0.85, Math.PI * 2.15);
      ctx.fill();

      // Poni samping & jepit rambut toska pastel
      if (dir !== 'up') {
        ctx.fillStyle = '#181824';
        ctx.beginPath();
        ctx.moveTo(playerState.x - 6.5, headY - 2);
        ctx.quadraticCurveTo(playerState.x - 2, headY + 1, playerState.x - 4, headY + 2.5);
        ctx.lineTo(playerState.x - 7, headY + 1);
        ctx.closePath();
        ctx.fill();

        // Jepit rambut toska di poni (Hairpin)
        ctx.fillStyle = '#5FE1B0';
        ctx.fillRect(playerState.x - 5.5, headY - 2.5, 2.8, 1.5);
      }

      // 5.9 Kuncir Ekor Kuda (Ponytail) Dinamis
      const ponyBob = isAirborne ? -6 : (walkCycle * 2.5);
      const ponyBaseX = dir === 'right' ? playerState.x - 6 : (dir === 'left' ? playerState.x + 6 : playerState.x);
      const ponyBaseY = headY - 4;

      // Karet kuncir rambut toska
      ctx.fillStyle = '#0D9488';
      ctx.beginPath();
      ctx.arc(ponyBaseX, ponyBaseY, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Ekor kuncir kuda melenting
      ctx.fillStyle = '#181824';
      ctx.beginPath();
      if (dir === 'left') {
        ctx.moveTo(ponyBaseX, ponyBaseY);
        ctx.quadraticCurveTo(ponyBaseX + 6, ponyBaseY - 2 + ponyBob, ponyBaseX + 8, ponyBaseY + 6 + ponyBob);
        ctx.quadraticCurveTo(ponyBaseX + 3, ponyBaseY + 4, ponyBaseX, ponyBaseY);
      } else if (dir === 'right') {
        ctx.moveTo(ponyBaseX, ponyBaseY);
        ctx.quadraticCurveTo(ponyBaseX - 6, ponyBaseY - 2 + ponyBob, ponyBaseX - 8, ponyBaseY + 6 + ponyBob);
        ctx.quadraticCurveTo(ponyBaseX - 3, ponyBaseY + 4, ponyBaseX, ponyBaseY);
      } else {
        ctx.moveTo(ponyBaseX - 1, ponyBaseY);
        ctx.quadraticCurveTo(ponyBaseX + 5, ponyBaseY - 3 + ponyBob, ponyBaseX + 4, ponyBaseY + 7 + ponyBob);
        ctx.quadraticCurveTo(ponyBaseX + 1, ponyBaseY + 3, ponyBaseX - 1, ponyBaseY);
      }
      ctx.fill();

      ctx.restore();
    }

    // 5b. Danger Vignette when Ghost is Near (Progressively deeper crimson horror effect)
    if (room.ghost && !room.ghost.isDissolved) {
      const gs = ghostStateRef.current;
      const currentGhostX = gs.x + gs.twitchX;
      const currentGhostY = gs.y + Math.sin(Date.now() / 320) * 8 + gs.twitchY;
      const dist = Math.hypot(playerState.x - currentGhostX, playerState.y - currentGhostY);
      
      if (dist < 240) {
        // Proximity ratio: 0.0 at 240px, 1.0 at 45px
        const proximityRatio = Math.max(0, Math.min(1, (240 - dist) / 195));
        const pulse = Math.sin(Date.now() / 130) * 0.14;
        const baseAlpha = Math.min(0.9, proximityRatio * 0.8 + pulse * 0.12);

        ctx.save();
        // Progressive deep red radial gradient: edges darken and turn blood red
        const innerRadius = Math.max(10, width * (0.35 - proximityRatio * 0.22));
        const outerRadius = width * 0.65;
        const dangerGrad = ctx.createRadialGradient(
          width / 2, height / 2, innerRadius,
          width / 2, height / 2, outerRadius
        );
        dangerGrad.addColorStop(0, 'rgba(220, 20, 50, 0)');
        dangerGrad.addColorStop(0.35, `rgba(180, 0, 30, ${Math.max(0, (proximityRatio - 0.25) * 0.45)})`);
        dangerGrad.addColorStop(0.75, `rgba(220, 20, 50, ${baseAlpha * 0.82})`);
        dangerGrad.addColorStop(1, `rgba(140, 0, 20, ${baseAlpha})`);

        ctx.fillStyle = dangerGrad;
        ctx.fillRect(0, 0, width, height);

        // Horror edge blood veins & scratch marks when very close (> 0.4)
        if (proximityRatio > 0.4) {
          ctx.strokeStyle = `rgba(180, 0, 20, ${(proximityRatio - 0.35) * 0.9})`;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          // Corner scratch marks
          ctx.moveTo(0, 0);
          ctx.lineTo(width * 0.14, height * 0.1);
          ctx.moveTo(width, 0);
          ctx.lineTo(width * 0.86, height * 0.1);
          ctx.moveTo(0, height);
          ctx.lineTo(width * 0.14, height * 0.9);
          ctx.moveTo(width, height);
          ctx.lineTo(width * 0.86, height * 0.9);
          // Additional jagged scratch
          ctx.moveTo(width * 0.5, 0);
          ctx.lineTo(width * 0.52, 18);
          ctx.moveTo(width * 0.5, height);
          ctx.lineTo(width * 0.48, height - 18);
          ctx.stroke();
        }

        // Red CRT glitch scanlines when in critical danger (< 95px, ratio > 0.65)
        if (proximityRatio > 0.65) {
          ctx.fillStyle = 'rgba(255, 0, 50, 0.09)';
          for (let y = 0; y < height; y += 3) {
            ctx.fillRect(0, y, width, 1.2);
          }
        }

        ctx.restore();
      }
    }

    // 6. Dynamic Flashlight Darkness Overlay (Ray cone)
    ctx.save();
    // Create an offscreen dark canvas or destination-out masking
    const lightAngle = Math.atan2(
      mousePosRef.current.y - playerState.y,
      mousePosRef.current.x - playerState.x
    );

    // Dark mask covering entire room
    ctx.fillStyle = '#080d19';
    ctx.globalCompositeOperation = 'source-over';

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) {
      // Periodic fluorescent light tube flicker blackout
      const nowTime = Date.now();
      if (nowTime > flickerRef.current.nextFlicker) {
        flickerRef.current.isDark = true;
        flickerRef.current.duration = Math.random() * 120 + 60;
        flickerRef.current.nextFlicker = nowTime + Math.random() * 4500 + 3500;
      }
      if (
        flickerRef.current.isDark &&
        nowTime > flickerRef.current.nextFlicker - 4000 + flickerRef.current.duration
      ) {
        flickerRef.current.isDark = false;
      }

      // Fill pitch black
      const baseDarkAlpha = playerState.flashlightOn ? 0.94 : 0.985;
      maskCtx.fillStyle = `rgba(8, 13, 25, ${baseDarkAlpha})`;
      maskCtx.fillRect(0, 0, width, height);

      maskCtx.globalCompositeOperation = 'destination-out';

      // Narrow ambient glow right around Nara
      const playerGlow = maskCtx.createRadialGradient(playerState.x, playerState.y, 2, playerState.x, playerState.y, 38);
      playerGlow.addColorStop(0, 'rgba(0, 0, 0, 1)');
      playerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      maskCtx.fillStyle = playerGlow;
      maskCtx.beginPath();
      maskCtx.arc(playerState.x, playerState.y, 38, 0, Math.PI * 2);
      maskCtx.fill();

      // Flashlight cone if senter is turned ON
      if (playerState.flashlightOn && playerState.battery > 0) {
        // Ghost proximity causes flashlight to jitter/flicker nervously
        const fearFlicker = Math.random() < 0.2 ? (Math.random() - 0.5) * 28 : 0;
        const coneRadius = Math.max(130, 240 + fearFlicker);
        const coneAngleWidth = 0.52; // ~30 degrees wide cone
        const coneGrad = maskCtx.createRadialGradient(
          playerState.x, playerState.y, 10,
          playerState.x, playerState.y, coneRadius
        );
        coneGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
        coneGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0.85)');
        coneGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        maskCtx.fillStyle = coneGrad;
        maskCtx.beginPath();
        maskCtx.moveTo(playerState.x, playerState.y);
        maskCtx.arc(
          playerState.x,
          playerState.y,
          coneRadius,
          lightAngle - coneAngleWidth,
          lightAngle + coneAngleWidth
        );
        maskCtx.closePath();
        maskCtx.fill();
      }

      ctx.drawImage(maskCanvas, 0, 0);
    }
    ctx.restore();

    // 7. Warm Light Tint inside cone
    if (playerState.flashlightOn && playerState.battery > 0) {
      ctx.save();
      const warmGrad = ctx.createRadialGradient(playerState.x, playerState.y, 5, playerState.x, playerState.y, 200);
      warmGrad.addColorStop(0, 'rgba(242, 193, 78, 0.15)');
      warmGrad.addColorStop(1, 'rgba(242, 193, 78, 0)');
      ctx.fillStyle = warmGrad;
      ctx.beginPath();
      ctx.arc(playerState.x, playerState.y, 200, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 8. LENSA NALAR CONCEPTUAL LAYER (When Shift is held)
    if (playerState.lensaNalarActive) {
      ctx.save();
      // Scanlines & Green Grid
      ctx.strokeStyle = 'rgba(95, 225, 176, 0.15)';
      ctx.lineWidth = 0.8;
      for (let y = 0; y < height; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render conceptual layers for all objects
      for (const obj of room.objects) {
        let textToShow = obj.conceptualLayerText;
        if (obj.type === 'door' && !obj.id.includes('back')) {
          const roomPuzzles = room.objects.filter((o) => o.type === 'puzzle');
          const solvedCount = roomPuzzles.filter((p) => p.solved).length;
          const totalCount = roomPuzzles.length;
          if (totalCount > 0 && solvedCount === totalCount) {
            textToShow = `Kunci Keamanan: TERBUKA (Semua ${totalCount} teka-teki selesai!)`;
          } else {
            textToShow = `Kunci: TERKUNCI (${solvedCount}/${totalCount}). Wajib selesaikan semua!`;
          }
        }

        if (textToShow) {
          ctx.fillStyle = 'rgba(9, 21, 28, 0.85)';
          ctx.strokeStyle = '#5FE1B0';
          ctx.lineWidth = 1;
          const boxX = Math.max(10, Math.min(width - 250, obj.x - 40));
          const boxY = Math.max(20, obj.y - 28);
          ctx.fillRect(boxX, boxY, 240, 24);
          ctx.strokeRect(boxX, boxY, 240, 24);

          ctx.fillStyle = '#5FE1B0';
          ctx.font = '10px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`📐 ${textToShow.slice(0, 38)}`, boxX + 4, boxY + 16);
        }
      }

      // Ghost misconception layer
      if (room.ghost && !room.ghost.isDissolved) {
        ctx.fillStyle = 'rgba(232, 93, 117, 0.9)';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`⚠ MISKONSEPSI: ${room.ghost.misconception}`, width / 2, 35);
      }

      ctx.restore();
    }

    // 9. Prompt banner when near an interactive object
    if (nearbyObject) {
      ctx.save();
      ctx.fillStyle = 'rgba(11, 16, 38, 0.92)';

      const isDoor = nearbyObject.type === 'door';
      const isBackDoor = nearbyObject.id.includes('back');
      const roomPuzzles = room.objects.filter((o) => o.type === 'puzzle');
      const solvedCount = roomPuzzles.filter((p) => p.solved).length;
      const totalCount = roomPuzzles.length;
      const isUnlocked = totalCount === 0 || solvedCount === totalCount;

      let bannerText = `[E] Interaksi: ${nearbyObject.label}`;
      let borderColor = '#F2C14E';
      let textColor = '#F2C14E';

      if (isDoor) {
        if (isBackDoor) {
          bannerText = `[E] ⬅ Kembali ke Ruangan Sebelumnya`;
          borderColor = '#94a3b8';
          textColor = '#cbd5e1';
        } else if (isUnlocked) {
          bannerText = `[E] 🔓 Masuk ke Level Berikutnya!`;
          borderColor = '#5FE1B0';
          textColor = '#5FE1B0';
        } else {
          bannerText = `[E] 🔒 PINTU TERKUNCI (${solvedCount}/${totalCount} Selesai - Selesaikan Semua Teka-Teki!)`;
          borderColor = '#E85D75';
          textColor = '#f87171';
        }
      }

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2;
      const bannerW = Math.max(280, Math.min(width - 40, bannerText.length * 8.2));
      const bannerH = 34;
      const bannerX = width / 2 - bannerW / 2;
      const bannerY = height - 48;
      ctx.fillRect(bannerX, bannerY, bannerW, bannerH);
      ctx.strokeRect(bannerX, bannerY, bannerW, bannerH);

      ctx.fillStyle = textColor;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(bannerText, width / 2, bannerY + 21);
      ctx.restore();
    }
  }, [playerState, room, nearbyObject, jumpTick]);

  return (
    <div className="relative w-full flex-1 flex items-center justify-center bg-[#090d1f] p-1 sm:p-2 overflow-hidden min-h-0">
      <div className="relative border-2 sm:border-4 border-[#16213E] rounded-xl shadow-2xl overflow-hidden bg-black max-w-full max-h-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={room.bounds.width}
          height={room.bounds.height}
          onMouseMove={handleMouseMove}
          onClick={() => {
            if (nearbyObject) onInteractWithObject(nearbyObject);
          }}
          className="cursor-crosshair w-full max-w-[700px] max-h-[calc(100vh-170px)] aspect-[700/420] object-contain block select-none"
        />
      </div>
    </div>
  );
};
