import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './PlayAndEarn.module.css';
import { 
  X, 
  RotateCcw, 
  ChevronRight, 
  Timer, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  Info, 
  Share2, 
  Star, 
  Zap, 
  Pause, 
  Play,
  Flame,
  Gamepad2,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const GAME_DURATION = 20;

export function XPGame({ isOpen, onClose, onFinishGame, user, highScore = 92, initialMode = 'start' }) {
  // Top-level UI lifecycle state: 'start' | 'playing' | 'paused' | 'result'
  const [gameState, setGameState] = useState(initialMode);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [timeLeftDisplay, setTimeLeftDisplay] = useState(GAME_DURATION);
  const [multiplierDisplay, setMultiplierDisplay] = useState(1);
  const [multiplierTimerDisplay, setMultiplierTimerDisplay] = useState(0);
  const [comboDisplay, setComboDisplay] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentScoreResult, setCurrentScoreResult] = useState(0);

  const canvasRef = useRef(null);
  const arenaRef = useRef(null);
  const animationFrameRef = useRef(null);

  // High performance Game Engine Ref (Decoupled from React render cycle)
  const engineRef = useRef({
    state: 'start',
    width: 400,
    height: 520,
    dpr: 1,
    catcher: {
      x: 200,          // Current pixel position
      targetX: 200,    // Target pixel position for smooth lerp
      width: 96,
      height: 38,
      speed: 520,      // Pixels per second for keyboard
      vx: 0,
      catchPulse: 0,   // Ripple animation timer
    },
    keys: {
      left: false,
      right: false,
    },
    isPointerDown: false,
    items: [],
    particles: [],
    floatingTexts: [],
    score: 0,
    combo: 0,
    multiplier: 1,
    multiplierTimer: 0,
    timeLeft: GAME_DURATION,
    lastTime: 0,
    lastSpawnTime: 0,
    spawnInterval: 0.32, // Seconds between item spawns
    screenShake: 0,
  });

  // Sync mute state with sound utility
  const toggleSound = () => {
    const nextMute = !isMuted;
    soundFx.muted = nextMute;
    setIsMuted(nextMute);
  };

  // Reset engine for a fresh run
  const resetEngine = useCallback((canvasWidth, canvasHeight) => {
    const engine = engineRef.current;
    engine.state = 'playing';
    engine.width = canvasWidth || 400;
    engine.height = canvasHeight || 520;
    engine.catcher.x = engine.width / 2;
    engine.catcher.targetX = engine.width / 2;
    engine.catcher.vx = 0;
    engine.catcher.catchPulse = 0;
    engine.keys.left = false;
    engine.keys.right = false;
    engine.isPointerDown = false;
    engine.items = [];
    engine.particles = [];
    engine.floatingTexts = [];
    engine.score = 0;
    engine.combo = 0;
    engine.multiplier = 1;
    engine.multiplierTimer = 0;
    engine.timeLeft = GAME_DURATION;
    engine.lastTime = performance.now();
    engine.lastSpawnTime = performance.now();
    engine.screenShake = 0;

    setScoreDisplay(0);
    setTimeLeftDisplay(GAME_DURATION);
    setMultiplierDisplay(1);
    setMultiplierTimerDisplay(0);
    setComboDisplay(0);
  }, []);

  // Finish Game Handler
  const finishGameSession = useCallback((finalScore) => {
    const engine = engineRef.current;
    engine.state = 'result';
    setCurrentScoreResult(finalScore);
    setGameState('result');
    if (onFinishGame) {
      onFinishGame(finalScore);
    }
  }, [onFinishGame]);

  // Start arcade run
  const handleStartGame = () => {
    soundFx.playClick();
    setGameState('playing');
    const canvas = canvasRef.current;
    const width = canvas ? canvas.clientWidth : 400;
    const height = canvas ? canvas.clientHeight : 520;
    resetEngine(width, height);
  };

  // Pause / Resume handler
  const handleTogglePause = () => {
    soundFx.playClick();
    setGameState((prev) => {
      const next = prev === 'playing' ? 'paused' : 'playing';
      engineRef.current.state = next;
      if (next === 'playing') {
        engineRef.current.lastTime = performance.now();
      }
      return next;
    });
  };

  // Modal open/close listener
  useEffect(() => {
    if (isOpen) {
      if (initialMode === 'result') {
        setGameState('result');
        setCurrentScoreResult(highScore || 92);
      } else {
        setGameState('start');
      }
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isOpen, initialMode, highScore]);

  // Keyboard Event Listeners for smooth continuous polling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        engineRef.current.keys.left = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        engineRef.current.keys.right = true;
      } else if (e.key === 'p' || e.key === 'P' || e.key === ' ') {
        if (gameState === 'playing' || gameState === 'paused') {
          handleTogglePause();
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        engineRef.current.keys.left = false;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        engineRef.current.keys.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Pointer Movement Handlers with Pointer Capture for Butter-Smooth Dragging
  const handlePointerDown = (e) => {
    if (gameState !== 'playing') return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if setPointerCapture is unsupported
    }
    engineRef.current.isPointerDown = true;
    updateCatcherFromPointer(e);
  };

  const handlePointerMove = (e) => {
    if (gameState !== 'playing') return;
    updateCatcherFromPointer(e);
  };

  const handlePointerUp = (e) => {
    engineRef.current.isPointerDown = false;
    try {
      if (e.currentTarget.hasPointerCapture && e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
  };

  const updateCatcherFromPointer = (e) => {
    const arena = arenaRef.current;
    if (!arena) return;
    const rect = arena.getBoundingClientRect();
    const clientX = e.clientX;
    if (clientX === undefined) return;

    const relativeX = clientX - rect.left;
    const halfWidth = engineRef.current.catcher.width / 2;
    const clampedX = Math.max(halfWidth, Math.min(rect.width - halfWidth, relativeX));
    
    // Set target for smooth interpolation and direct response
    engineRef.current.catcher.targetX = clampedX;
    // Fast responsiveness for finger touch
    engineRef.current.catcher.x = clampedX;
  };

  // Helper: Particle creation
  const spawnParticles = (x, y, color, count = 12) => {
    const engine = engineRef.current;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = Math.random() * 160 + 80;
      engine.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        color,
        size: Math.random() * 4 + 3,
        alpha: 1,
        life: 0.55,
        maxLife: 0.55,
      });
    }
  };

  // Helper: Floating text on canvas
  const addFloatingText = (text, x, y, color) => {
    engineRef.current.floatingTexts.push({
      text,
      x,
      y,
      color,
      vy: -70,
      alpha: 1,
      life: 0.8,
      maxLife: 0.8,
    });
  };

  // Main High-DPI 60/120 FPS Canvas Physics & Render Engine
  useEffect(() => {
    if (gameState !== 'playing' && gameState !== 'paused') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // High-DPI setup
    const updateCanvasSize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      engineRef.current.width = rect.width;
      engineRef.current.height = rect.height;
      engineRef.current.dpr = dpr;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const engine = engineRef.current;
    engine.lastTime = performance.now();
    let hudUpdateTimer = 0;

    const gameLoop = (currentTime) => {
      const dt = Math.min((currentTime - engine.lastTime) / 1000, 0.1);
      engine.lastTime = currentTime;

      if (engine.state === 'playing') {
        // 1. Timer countdown
        engine.timeLeft -= dt;
        if (engine.timeLeft <= 0) {
          engine.timeLeft = 0;
          finishGameSession(engine.score);
          return;
        }

        // Multiplier countdown
        if (engine.multiplierTimer > 0) {
          engine.multiplierTimer -= dt;
          if (engine.multiplierTimer <= 0) {
            engine.multiplier = 1;
            engine.multiplierTimer = 0;
          }
        }

        // 2. Keyboard continuous physics
        const halfWidth = engine.catcher.width / 2;
        if (engine.keys.left && !engine.keys.right) {
          engine.catcher.vx = -engine.catcher.speed;
        } else if (engine.keys.right && !engine.keys.left) {
          engine.catcher.vx = engine.catcher.speed;
        } else {
          engine.catcher.vx *= 0.82; // Friction damping
          if (Math.abs(engine.catcher.vx) < 5) engine.catcher.vx = 0;
        }

        if (engine.catcher.vx !== 0) {
          engine.catcher.x += engine.catcher.vx * dt;
          engine.catcher.x = Math.max(halfWidth, Math.min(engine.width - halfWidth, engine.catcher.x));
          engine.catcher.targetX = engine.catcher.x;
        } else if (!engine.isPointerDown) {
          // Smooth spring to target
          engine.catcher.x += (engine.catcher.targetX - engine.catcher.x) * 0.35;
        }

        // Screen shake decay
        if (engine.screenShake > 0) {
          engine.screenShake = Math.max(0, engine.screenShake - dt * 25);
        }

        // Catch ripple decay
        if (engine.catcher.catchPulse > 0) {
          engine.catcher.catchPulse = Math.max(0, engine.catcher.catchPulse - dt * 4);
        }

        // 3. Item spawning
        if (currentTime - engine.lastSpawnTime > engine.spawnInterval * 1000) {
          engine.lastSpawnTime = currentTime;
          
          const types = [
            { type: 'xp', label: 'XP', color: '#38bdf8', glow: '#0284c7', value: 10, radius: 16, weight: 40 },
            { type: 've', label: 'V', color: '#fbbf24', glow: '#d97706', value: 15, radius: 15, weight: 25 },
            { type: 'gem', label: '💎', color: '#34d399', glow: '#059669', value: 25, radius: 17, weight: 15 },
            { type: 'xp_big', label: '⚡', color: '#c084fc', glow: '#7e22ce', value: 35, radius: 19, weight: 10 },
            { type: 'mult', label: '2X', color: '#f472b6', glow: '#db2777', value: 0, radius: 17, isMult: true, weight: 6 },
            { type: 'bomb', label: '💣', color: '#f87171', glow: '#dc2626', value: -15, radius: 15, isBomb: true, weight: 14 },
          ];

          // Weighted random selection
          const totalWeight = types.reduce((acc, t) => acc + t.weight, 0);
          let rand = Math.random() * totalWeight;
          let chosen = types[0];
          for (const t of types) {
            if (rand < t.weight) {
              chosen = t;
              break;
            }
            rand -= t.weight;
          }

          const margin = 28;
          const spawnX = Math.random() * (engine.width - margin * 2) + margin;
          const fallSpeed = Math.random() * 80 + 220; // Pixels per second

          engine.items.push({
            id: Math.random(),
            x: spawnX,
            y: -24,
            speed: fallSpeed,
            rotation: 0,
            rotSpeed: (Math.random() - 0.5) * 4,
            ...chosen,
          });
        }

        // 4. Update falling items & collision logic
        const basketW = engine.catcher.width;
        const basketH = engine.catcher.height;
        const basketX = engine.catcher.x - basketW / 2;
        const basketY = engine.height - 62;

        engine.items = engine.items.filter((item) => {
          item.y += item.speed * dt;
          item.rotation += item.rotSpeed * dt;

          // Hitbox check
          const inX = item.x >= basketX - 12 && item.x <= basketX + basketW + 12;
          const inY = item.y >= basketY - 14 && item.y <= basketY + basketH + 4;

          if (inX && inY) {
            engine.catcher.catchPulse = 1.0;
            
            if (item.isBomb) {
              engine.combo = 0;
              engine.score = Math.max(0, engine.score - 15);
              engine.screenShake = 12;
              soundFx.playClick();
              spawnParticles(item.x, item.y, '#ef4444', 16);
              addFloatingText('-15 XP 💣', item.x, item.y, '#ef4444');
            } else if (item.isMult) {
              engine.multiplier = 2;
              engine.multiplierTimer = 6;
              soundFx.playMultiplier();
              spawnParticles(item.x, item.y, '#ec4899', 20);
              addFloatingText('⚡ 2X BOOST ACTIVE!', item.x, item.y - 10, '#f472b6');
            } else {
              engine.combo += 1;
              const comboBonus = engine.combo > 3 ? Math.min(15, (engine.combo - 3) * 3) : 0;
              const points = (item.value + comboBonus) * engine.multiplier;
              engine.score += points;

              if (item.type === 've') {
                soundFx.playCoin();
                spawnParticles(item.x, item.y, '#fbbf24', 14);
                addFloatingText(`+${points} VEs`, item.x, item.y, '#fbbf24');
              } else if (item.type === 'gem') {
                soundFx.playStreak();
                spawnParticles(item.x, item.y, '#34d399', 16);
                addFloatingText(`+${points} 💎`, item.x, item.y, '#34d399');
              } else if (item.type === 'xp_big') {
                soundFx.playLevelUp();
                spawnParticles(item.x, item.y, '#c084fc', 18);
                addFloatingText(`+${points} ULTRA XP!`, item.x, item.y, '#c084fc');
              } else {
                soundFx.playXP();
                spawnParticles(item.x, item.y, '#38bdf8', 12);
                addFloatingText(
                  engine.combo > 3 ? `+${points} XP (${engine.combo}x Combo!)` : `+${points} XP`,
                  item.x,
                  item.y,
                  '#38bdf8'
                );
              }
            }
            return false;
          }

          return item.y < engine.height + 40;
        });

        // 5. Update Particles
        engine.particles = engine.particles.filter((p) => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 260 * dt; // Gravity
          p.life -= dt;
          p.alpha = Math.max(0, p.life / p.maxLife);
          return p.life > 0;
        });

        // 6. Update Floating Texts
        engine.floatingTexts = engine.floatingTexts.filter((ft) => {
          ft.y += ft.vy * dt;
          ft.life -= dt;
          ft.alpha = Math.max(0, ft.life / ft.maxLife);
          return ft.life > 0;
        });

        // 7. Throttled UI state sync (every 100ms for smooth 60fps React overhead)
        hudUpdateTimer += dt;
        if (hudUpdateTimer >= 0.1) {
          hudUpdateTimer = 0;
          setScoreDisplay(engine.score);
          setTimeLeftDisplay(Math.ceil(engine.timeLeft));
          setMultiplierDisplay(engine.multiplier);
          setMultiplierTimerDisplay(Math.ceil(engine.multiplierTimer));
          setComboDisplay(engine.combo);
        }
      }

      // ==================== RENDERING ====================
      const w = engine.width;
      const h = engine.height;

      // Background
      ctx.save();
      if (engine.screenShake > 0) {
        const shakeAngle = Math.random() * Math.PI * 2;
        const shakeOffset = engine.screenShake;
        ctx.translate(Math.cos(shakeAngle) * shakeOffset, Math.sin(shakeAngle) * shakeOffset);
      }

      // Gradient background
      const bgGrad = ctx.createRadialGradient(w / 2, h * 0.35, 20, w / 2, h / 2, h * 0.85);
      bgGrad.addColorStop(0, '#13182c');
      bgGrad.addColorStop(0.5, '#0b0e1b');
      bgGrad.addColorStop(1, '#05070d');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Cyber Grid Background Lines (Subtle aesthetic depth)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let gx = 0; gx < w; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      // Falling items render
      engine.items.forEach((item) => {
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);

        // Glow ring
        ctx.beginPath();
        ctx.arc(0, 0, item.radius + 3, 0, Math.PI * 2);
        ctx.fillStyle = `${item.glow}33`;
        ctx.fill();

        // Base gradient orb
        const orbGrad = ctx.createRadialGradient(-item.radius * 0.3, -item.radius * 0.3, item.radius * 0.1, 0, 0, item.radius);
        orbGrad.addColorStop(0, '#ffffff');
        orbGrad.addColorStop(0.35, item.color);
        orbGrad.addColorStop(1, item.glow);

        ctx.beginPath();
        ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = orbGrad;
        ctx.shadowColor = item.glow;
        ctx.shadowBlur = 10;
        ctx.fill();

        // Metallic border rim
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.stroke();

        // Text / Emoji label
        ctx.fillStyle = '#ffffff';
        ctx.font = item.label.length > 2 ? 'bold 10px Outfit, sans-serif' : 'bold 12px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, 0, 1);

        ctx.restore();
      });

      // Particles render
      engine.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Catcher Basket directly on canvas (Zero DOM delay, 100% sync)
      const basketWidth = engine.catcher.width;
      const basketHeight = engine.catcher.height;
      const bX = engine.catcher.x - basketWidth / 2;
      const bY = h - 62;
      const pulse = engine.catcher.catchPulse;

      ctx.save();
      // Glow under catcher
      const underGlow = ctx.createRadialGradient(
        engine.catcher.x,
        bY + basketHeight / 2,
        5,
        engine.catcher.x,
        bY + basketHeight / 2,
        basketWidth * 0.8
      );
      underGlow.addColorStop(0, pulse > 0 ? 'rgba(251, 191, 36, 0.5)' : 'rgba(56, 189, 248, 0.25)');
      underGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = underGlow;
      ctx.fillRect(bX - 20, bY - 10, basketWidth + 40, basketHeight + 30);

      // Net Mesh / Energy field
      const meshGrad = ctx.createLinearGradient(0, bY, 0, bY + basketHeight);
      meshGrad.addColorStop(0, pulse > 0 ? 'rgba(251, 191, 36, 0.35)' : 'rgba(56, 189, 248, 0.2)');
      meshGrad.addColorStop(1, 'rgba(56, 189, 248, 0.02)');
      
      ctx.beginPath();
      ctx.moveTo(bX + 8, bY + 8);
      ctx.lineTo(bX + basketWidth - 8, bY + 8);
      ctx.quadraticCurveTo(bX + basketWidth - 10, bY + basketHeight, engine.catcher.x, bY + basketHeight + (pulse * 4));
      ctx.quadraticCurveTo(bX + 10, bY + basketHeight, bX + 8, bY + 8);
      ctx.fillStyle = meshGrad;
      ctx.fill();
      ctx.strokeStyle = pulse > 0 ? 'rgba(251, 191, 36, 0.8)' : 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Energy net grid strands
      ctx.strokeStyle = pulse > 0 ? 'rgba(251, 191, 36, 0.4)' : 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      for (let sx = bX + 18; sx < bX + basketWidth - 14; sx += 12) {
        ctx.beginPath();
        ctx.moveTo(sx, bY + 8);
        ctx.lineTo(engine.catcher.x, bY + basketHeight);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Top Cyber / Gold Basket Rim
      const rimGrad = ctx.createLinearGradient(bX, 0, bX + basketWidth, 0);
      if (pulse > 0) {
        rimGrad.addColorStop(0, '#fef08a');
        rimGrad.addColorStop(0.5, '#f59e0b');
        rimGrad.addColorStop(1, '#b45309');
      } else {
        rimGrad.addColorStop(0, '#ffd700');
        rimGrad.addColorStop(0.5, '#f59e0b');
        rimGrad.addColorStop(1, '#d97706');
      }

      ctx.beginPath();
      ctx.roundRect(bX, bY, basketWidth, 12, 6);
      ctx.fillStyle = rimGrad;
      ctx.shadowColor = pulse > 0 ? '#fbbf24' : '#f59e0b';
      ctx.shadowBlur = pulse > 0 ? 16 : 8;
      ctx.fill();

      // Rim metallic top highlight
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Thruster indicator lights on the rim sides
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(bX + 6, bY + 6, 2.5, 0, Math.PI * 2);
      ctx.arc(bX + basketWidth - 6, bY + 6, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Floating Texts render
      engine.floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.fillStyle = ft.color;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 6;
        ctx.font = '900 13px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      ctx.restore(); // Shake restore

      if (engine.state === 'playing' || engine.state === 'paused') {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, finishGameSession]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.gameCard}>
        {/* ================= STATE 1: START SCREEN ================= */}
        {gameState === 'start' && (
          <div className={styles.startScreen}>
            <div className={styles.gameTopBar}>
              <button 
                className={styles.backBtn}
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                title="Return"
              >
                <ArrowLeft size={20} />
              </button>

              <div className={styles.gameHeaderTitle}>
                <Gamepad2 size={20} className={styles.gameTitleIcon} />
                <h3>XP CATCHER ARCADE</h3>
                <span className={styles.infoBadge} title="Catch XP to level up!">
                  <Info size={14} />
                </span>
              </div>

              <div className={styles.topRightTools}>
                <button className={styles.toolBtn} onClick={toggleSound} title={isMuted ? 'Unmute' : 'Mute'}>
                  {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                </button>
                <button className={styles.closeBtn} onClick={onClose} title="Close">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className={styles.startBody}>
              <p className={styles.gameSubtitle}>
                Drag or use Arrow keys to catch falling XP orbs, coins & gems. Avoid bombs to build massive score combos!
              </p>

              <div className={styles.startHeroGraphic}>
                <div className={styles.orbitContainer}>
                  <div className={`${styles.demoOrb} ${styles.orbXP}`}>XP</div>
                  <div className={`${styles.demoOrb} ${styles.orbVE}`}>V</div>
                  <div className={`${styles.demoOrb} ${styles.orbGem}`}>💎</div>
                  <div className={`${styles.demoOrb} ${styles.orbVolt}`}>⚡</div>
                  <div className={styles.demoBasket}></div>
                </div>
              </div>

              <div className={styles.highScoreCard}>
                <span className={styles.highScoreLabel}>Personal Best</span>
                <span className={styles.highScoreVal}>{highScore} PTS</span>
              </div>

              <div className={styles.rulesList}>
                <div className={styles.rulePill}>⏱️ <strong>20s</strong> Lightning Reflex Challenge</div>
                <div className={styles.rulePill}>🎮 Drag anywhere or use <strong>← / → / A / D</strong> keys</div>
                <div className={styles.rulePill}>✨ Earn up to <strong>+80 XP</strong> & <strong>+25 VEs</strong> per run</div>
              </div>

              <button className={styles.startBtn} onClick={handleStartGame}>
                <Zap size={18} />
                <span>START ARCADE RUN</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STATE 2: ACTIVE GAMEPLAY & PAUSE ================= */}
        {(gameState === 'playing' || gameState === 'paused') && (
          <div 
            ref={arenaRef}
            className={styles.playArena}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Header HUD Bar */}
            <div className={styles.playHeaderBar}>
              <button 
                className={styles.backBtn}
                onClick={() => {
                  soundFx.playClick();
                  setGameState('start');
                }}
                title="Quit to menu"
              >
                <ArrowLeft size={18} />
              </button>

              <div className={styles.gameHeaderTitle}>
                <h3>XP CATCHER</h3>
                {comboDisplay > 2 && (
                  <span className={styles.comboPill}>
                    <Flame size={12} /> {comboDisplay}X COMBO!
                  </span>
                )}
              </div>

              <div className={styles.headerRightControls}>
                <button 
                  className={styles.pauseBtn} 
                  onClick={handleTogglePause}
                  title={gameState === 'paused' ? 'Resume' : 'Pause'}
                >
                  {gameState === 'paused' ? <Play size={15} /> : <Pause size={15} />}
                </button>
                <div className={`${styles.timerPill} ${timeLeftDisplay <= 5 ? styles.timerPillUrgent : ''}`}>
                  <Timer size={14} />
                  <span>00:{timeLeftDisplay < 10 ? `0${timeLeftDisplay}` : timeLeftDisplay}</span>
                </div>
              </div>
            </div>

            {/* High-DPI Canvas for 60/120 FPS Rendering */}
            <canvas ref={canvasRef} className={styles.gameCanvas} />

            {/* Pause Overlay */}
            {gameState === 'paused' && (
              <div className={styles.pauseOverlay}>
                <div className={styles.pauseCard}>
                  <Pause size={36} className={styles.pauseIcon} />
                  <h3>GAME PAUSED</h3>
                  <p>Catch your breath! Click below to resume your arcade run.</p>
                  <button className={styles.resumeBtn} onClick={handleTogglePause}>
                    <Play size={16} />
                    <span>RESUME RUN</span>
                  </button>
                </div>
              </div>
            )}

            {/* Controls Bar */}
            <div className={styles.keyboardHint}>
              <span>Drag screen or use <strong>← / →</strong></span>
            </div>

            {/* Bottom Status HUD */}
            <div className={styles.playFooterBar}>
              <div className={styles.scoreContainer}>
                <span className={styles.scoreLabel}>SCORE</span>
                <span className={styles.scoreValue}>{scoreDisplay}</span>
              </div>

              <div className={styles.footerBadges}>
                <div className={`${styles.multBadge} ${multiplierDisplay > 1 ? styles.multActive : ''}`}>
                  <Sparkles size={13} />
                  <span>2X Multiplier {multiplierTimerDisplay > 0 ? `(${multiplierTimerDisplay}s)` : ''}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STATE 3: RESULT SCREEN ================= */}
        {gameState === 'result' && (
          <div className={styles.resultScreen}>
            <div className={styles.resultTopBar}>
              <button 
                className={styles.backBtn}
                onClick={() => setGameState('start')}
                title="Back to start"
              >
                <ArrowLeft size={20} />
              </button>
              <div className={styles.gameHeaderTitle}>
                <h3>RUN SUMMARY</h3>
              </div>
              <button 
                className={styles.toolBtn}
                onClick={() => soundFx.playClick()}
                title="Share run"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Hero Badge */}
            <div className={styles.resultHero}>
              <div className={styles.laurelContainer}>
                <div className={styles.shieldGold}>
                  <Star size={36} className={styles.goldStarIcon} fill="#fbbf24" />
                </div>
                <div className={styles.laurelLeavesLeft}>🌿</div>
                <div className={styles.laurelLeavesRight}>🌿</div>
              </div>

              <h2 className={styles.completeTitle}>CHALLENGE COMPLETE!</h2>
              <span className={styles.completeSub}>Outstanding Performance!</span>
            </div>

            {/* Score Box */}
            <div className={styles.finalScoreBox}>
              <span className={styles.finalScoreLabel}>FINAL SCORE</span>
              <div className={styles.finalScoreRow}>
                <span className={styles.bigScore}>{currentScoreResult}</span>
                {currentScoreResult >= highScore && currentScoreResult > 0 && (
                  <span className={styles.newBestBadge}>🏆 New Best!</span>
                )}
              </div>
            </div>

            {/* Reward Cards */}
            <div className={styles.rewardCardsGrid}>
              <div className={styles.rewardCardItem}>
                <span className={styles.rcValue}>+{Math.max(20, Math.floor(currentScoreResult * 0.4))} XP</span>
                <span className={styles.rcLabel}>Experience Gained</span>
              </div>
              <div className={styles.rewardCardItem}>
                <span className={styles.rcValue}>+{Math.max(5, Math.floor(currentScoreResult * 0.2))} VEs</span>
                <span className={styles.rcLabel}>Token Reward</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.resultActions}>
              <button className={styles.playAgainBtn} onClick={handleStartGame}>
                <RotateCcw size={16} />
                <span>Play Again</span>
              </button>
              <button className={styles.backDashBtn} onClick={onClose}>
                <span>Collect & Return to Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
