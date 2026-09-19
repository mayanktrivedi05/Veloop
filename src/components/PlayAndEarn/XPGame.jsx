import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './PlayAndEarn.module.css';
import goldCoin from '../../assets/coins/gold.svg';
import xpOrb from '../../assets/coins/xp-1.svg';
import gemIcon from '../../assets/coins/gem.svg';
import cartSide from '../../assets/cart/cart-side.svg';
import safeIcon from '../../assets/safe/safe-2.svg';
import coinPileLow from '../../assets/pile-of-coins/low.svg';
import coinPileMedium from '../../assets/pile-of-coins/medium.svg';
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
  Zap, 
  Pause, 
  Play,
  Sparkles,
  Trophy
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const ROUND_DURATION_SEC = 25;
const CART_WIDTH = 130;
const CART_HEIGHT = 118;
const CART_BOTTOM_OFFSET = 8;
const CATCH_ZONE_HEIGHT = 18;
const CATCH_WIDTH = 84;
const CATCH_X_INSET = (CART_WIDTH - CATCH_WIDTH) / 2;

// Falling item definitions matching reference weights
const ITEM_TYPES = [
  { type: 'gold', src: goldCoin, points: 1, width: 40, height: 42, weight: 11, label: '+1' },
  { type: 'xp', src: xpOrb, points: 3, width: 56, height: 58, weight: 4, label: '+3 XP' },
  { type: 'gem', src: gemIcon, points: 5, width: 44, height: 52, weight: 2, label: '+5 💎' },
];

const TOTAL_WEIGHT = ITEM_TYPES.reduce((sum, t) => sum + t.weight, 0);

function pickItemType() {
  let roll = Math.random() * TOTAL_WEIGHT;
  for (const t of ITEM_TYPES) {
    if (roll < t.weight) return t;
    roll -= t.weight;
  }
  return ITEM_TYPES[0];
}

export function XPGame({ 
  isOpen, 
  onClose, 
  onFinishGame, 
  user = { currentLevel: 5, currentXP: 6420, requiredXP: 8000 }, 
  highScore = 92, 
  initialMode = 'countdown' 
}) {
  // Phase: 'countdown' | 'playing' | 'paused' | 'result'
  const [phase, setPhase] = useState('countdown');
  const [countdownNum, setCountdownNum] = useState(3);
  const [score, setScore] = useState(0);
  const [scoreBump, setScoreBump] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION_SEC);
  const [isMuted, setIsMuted] = useState(false);
  const [finalResult, setFinalResult] = useState({ score: 0, xp: 0, ve: 0 });
  const [progressWidth, setProgressWidth] = useState(0);

  const playAreaRef = useRef(null);
  const cartRef = useRef(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const cartXRef = useRef(0);
  const draggingRef = useRef(false);
  const keysRef = useRef({ left: false, right: false });
  const itemsRef = useRef([]);
  const scoreRef = useRef(0);
  const idRef = useRef(0);
  const rafRef = useRef(null);
  const startRef = useRef(0);
  const lastTsRef = useRef(0);
  const spawnAccRef = useRef(0);
  const onFinishRef = useRef(onFinishGame);
  onFinishRef.current = onFinishGame;

  const [catchLabels, setCatchLabels] = useState([]);
  const [renderedItems, setRenderedItems] = useState([]);

  const toggleSound = () => {
    const nextMute = !isMuted;
    soundFx.muted = nextMute;
    setIsMuted(nextMute);
  };

  // 1. Initial Launch / Reset
  useEffect(() => {
    if (isOpen) {
      setPhase('countdown');
      setCountdownNum(3);
      setScore(0);
      scoreRef.current = 0;
      setTimeLeft(ROUND_DURATION_SEC);
      itemsRef.current = [];
      setRenderedItems([]);
      setCatchLabels([]);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
  }, [isOpen]);

  // 2. Countdown Phase Timer
  useEffect(() => {
    if (!isOpen || phase !== 'countdown') return;

    soundFx.playClick();
    const timer = setTimeout(() => {
      if (countdownNum <= 1) {
        soundFx.playMultiplier();
        setPhase('playing');
      } else {
        setCountdownNum((c) => c - 1);
      }
    }, 750);

    return () => clearTimeout(timer);
  }, [isOpen, phase, countdownNum]);

  // 3. Play Area Measurement
  useEffect(() => {
    if (phase !== 'playing') return;
    const el = playAreaRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      sizeRef.current = { width: rect.width, height: rect.height };
      const startX = Math.max(0, (rect.width - CART_WIDTH) / 2);
      cartXRef.current = startX;
      if (cartRef.current) cartRef.current.style.transform = `translateX(${startX}px)`;
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  // 4. Keyboard Controls
  useEffect(() => {
    if (phase !== 'playing') return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = true;
      } else if (e.key === 'p' || e.key === 'P' || e.key === ' ') {
        setPhase((prev) => (prev === 'playing' ? 'paused' : 'playing'));
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = false;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [phase]);

  // 5. High-Performance 60/120 FPS Physics & Render Loop
  useEffect(() => {
    if (phase !== 'playing') return;

    startRef.current = performance.now();
    lastTsRef.current = performance.now();
    spawnAccRef.current = 0;
    const roundMs = ROUND_DURATION_SEC * 1000;

    const tick = (ts) => {
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.1);
      lastTsRef.current = ts;

      const elapsed = ts - startRef.current;
      const remainingMs = roundMs - elapsed;
      if (remainingMs <= 0) {
        setTimeLeft(0);
        const finalPts = scoreRef.current;
        const xpReward = Math.max(25, Math.floor(finalPts * 1.8));
        const veReward = Math.max(8, Math.floor(finalPts * 0.8));
        setFinalResult({ score: finalPts, xp: xpReward, ve: veReward });
        setPhase('result');
        soundFx.playLevelUp();
        if (onFinishRef.current) onFinishRef.current(finalPts);
        return;
      }

      setTimeLeft(Math.ceil(remainingMs / 1000));

      const { width, height } = sizeRef.current;
      if (width > 0) {
        // Continuous keyboard movement
        const { left, right } = keysRef.current;
        if (left !== right) {
          const dx = (right ? 1 : -1) * 520 * dt;
          const nextX = Math.min(Math.max(cartXRef.current + dx, 0), width - CART_WIDTH);
          cartXRef.current = nextX;
          if (cartRef.current) cartRef.current.style.transform = `translateX(${nextX}px)`;
        }

        // Spawn items
        spawnAccRef.current += dt * 1000;
        const spawnInterval = 480;
        while (spawnAccRef.current >= spawnInterval) {
          spawnAccRef.current -= spawnInterval;
          const def = pickItemType();
          itemsRef.current.push({
            id: idRef.current++,
            def,
            x: Math.random() * Math.max(0, width - def.width - 20) + 10,
            y: -def.height,
            speed: 160 + Math.random() * 80,
          });
        }

        // Hitbox collision
        const catchZoneTop = height - CART_BOTTOM_OFFSET - CART_HEIGHT + 10;
        const catchZoneBottom = catchZoneTop + CATCH_ZONE_HEIGHT + 14;
        const catchLeft = cartXRef.current + CATCH_X_INSET - 8;
        const catchRight = catchLeft + CATCH_WIDTH + 16;
        let gained = 0;
        const caught = [];
        const next = [];

        for (const item of itemsRef.current) {
          const newY = item.y + item.speed * dt;
          const itemCenterX = item.x + item.def.width / 2;
          const overlapsX = itemCenterX >= catchLeft && itemCenterX <= catchRight;
          const overlapsY = newY + item.def.height >= catchZoneTop && newY <= catchZoneBottom;

          if (overlapsX && overlapsY) {
            gained += item.def.points;
            caught.push({ id: item.id, x: item.x, y: newY, label: item.def.label, type: item.def.type });
            continue;
          }
          if (newY > height + 20) continue;
          next.push({ ...item, y: newY });
        }

        itemsRef.current = next;
        setRenderedItems([...next]);

        if (gained > 0) {
          scoreRef.current += gained;
          setScore(scoreRef.current);
          setScoreBump((b) => b + 1);

          // Audio
          if (caught.some((c) => c.type === 'gem')) {
            soundFx.playStreak();
          } else if (caught.some((c) => c.type === 'xp')) {
            soundFx.playXP();
          } else {
            soundFx.playCoin();
          }

          // Floating tags
          setCatchLabels((labels) => [
            ...labels,
            ...caught.map((c) => ({ id: c.id, x: c.x, y: c.y, text: c.label })),
          ]);

          caught.forEach((c) => {
            setTimeout(() => {
              setCatchLabels((labels) => labels.filter((l) => l.id !== c.id));
            }, 600);
          });
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  // Pointer drag movement
  const moveCartTo = (clientX) => {
    const el = playAreaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left - CART_WIDTH / 2, 0), rect.width - CART_WIDTH);
    cartXRef.current = x;
    if (cartRef.current) cartRef.current.style.transform = `translateX(${x}px)`;
  };

  const handlePointerDown = (e) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    draggingRef.current = true;
    moveCartTo(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (draggingRef.current) moveCartTo(e.clientX);
  };

  const handlePointerUp = (e) => {
    draggingRef.current = false;
    try {
      if (e.currentTarget.hasPointerCapture && e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
  };

  // Result Progress Animation
  useEffect(() => {
    if (phase === 'result') {
      const pct = Math.min(100, Math.round(((user.currentXP + finalResult.xp) / user.requiredXP) * 100));
      const t = setTimeout(() => setProgressWidth(pct), 150);
      return () => clearTimeout(t);
    }
  }, [phase, user, finalResult]);

  if (!isOpen) return null;

  const urgent = timeLeft <= 5;
  const currentTotalXP = user.currentXP + finalResult.xp;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.gameModalFrame} ${phase === 'result' ? styles.frameResult : ''}`}>
        
        {/* Top Close Button (for non-result or header) */}
        {phase !== 'result' && (
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close game" type="button">
            <X size={20} />
          </button>
        )}

        {/* ---------------- PHASE 1: COUNTDOWN ---------------- */}
        {phase === 'countdown' && (
          <div className={styles.countdownScreen}>
            <div className={styles.countdownBox}>
              <span key={countdownNum} className={styles.countdownNumber}>
                {countdownNum === 0 ? 'GO!' : countdownNum}
              </span>
              <p className={styles.countdownSub}>Get ready to catch VEs & XP!</p>
            </div>
          </div>
        )}

        {/* ---------------- PHASE 2: ACTIVE GAMEPLAY ---------------- */}
        {(phase === 'playing' || phase === 'paused') && (
          <div className={styles.playScreen}>
            {/* Top Bar HUD */}
            <div className={styles.playTopBar}>
              <div className={styles.topBarLeft}>
                <button 
                  className={styles.iconBtn} 
                  onClick={() => setPhase('paused')}
                  title="Pause"
                  type="button"
                >
                  {phase === 'paused' ? <Play size={16} /> : <Pause size={16} />}
                </button>
                <span className={`${styles.timerDisplay} ${urgent ? styles.timerDisplayUrgent : ''}`}>
                  00:{String(timeLeft).padStart(2, '0')}s
                </span>
              </div>

              <div className={styles.scoreBadge}>
                <span className={styles.scoreLabel}>Score:</span>
                <span key={scoreBump} className={`${styles.scoreValue} ${styles.scorePop}`}>
                  {score}
                </span>
              </div>

              <div className={styles.topBarRight}>
                <button className={styles.iconBtn} onClick={toggleSound} type="button">
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
            </div>

            {/* Instruction Banner */}
            <div className={styles.bannerBar}>
              <p className={styles.bannerLineGold}>Catch the coins and XP orbs!</p>
              <p className={styles.bannerLineLight}>Score high for better rewards!</p>
            </div>

            {/* Active Play Arena */}
            <div
              className={styles.arenaCanvas}
              ref={playAreaRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* Falling Item SVGs */}
              {renderedItems.map((item) => (
                <img
                  key={item.id}
                  className={styles.fallingItem}
                  src={item.def.src}
                  alt=""
                  aria-hidden="true"
                  style={{
                    width: item.def.width,
                    height: item.def.height,
                    transform: `translate(${item.x}px, ${item.y}px)`,
                  }}
                />
              ))}

              {/* Floating Catch Tags */}
              {catchLabels.map((label) => (
                <span
                  key={label.id}
                  className={styles.catchTag}
                  style={{ transform: `translate(${label.x}px, ${label.y}px)` }}
                >
                  {label.text}
                </span>
              ))}

              {/* Collector Cart */}
              <img
                ref={cartRef}
                className={styles.collectorCart}
                src={cartSide}
                alt=""
                aria-hidden="true"
              />
            </div>

            {/* Pause Overlay */}
            {phase === 'paused' && (
              <div className={styles.pauseBackdrop}>
                <div className={styles.pauseBox}>
                  <Pause size={36} color="var(--accent-gold)" />
                  <h3>RUN PAUSED</h3>
                  <p>Catch your breath! Click below to resume your arcade run.</p>
                  <button 
                    className={styles.resumeRunBtn} 
                    onClick={() => setPhase('playing')}
                    type="button"
                  >
                    <Play size={16} /> Resume Game
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Guidance Bar */}
            <div className={styles.bottomInstructionBar}>
              <span>
                <strong>← →</strong> arrow keys or <strong>drag</strong> to move collector
              </span>
            </div>
          </div>
        )}

        {/* ---------------- PHASE 3: CHALLENGE COMPLETE (RESULT) ---------------- */}
        {phase === 'result' && (
          <div className={styles.resultScreen}>
            <button
              className={styles.resultCloseBtn}
              type="button"
              aria-label="Close game"
              onClick={onClose}
            >
              <X size={20} />
            </button>

            <div className={styles.resultCard}>
              <h2 className={styles.resultHeading}>
                <span className={styles.headingGold}>Challenge</span>
                <br />
                <span className={styles.headingLight}>Complete!</span>
              </h2>
              <p className={styles.finalScoreRow}>Final Score: <strong>{finalResult.score}</strong></p>

              {/* Vault Canvas Graphic */}
              <div className={styles.vaultCanvas}>
                <img className={styles.vaultSafeArt} src={safeIcon} alt="" aria-hidden="true" />
                
                {/* Reward Clusters */}
                <div className={styles.rewardClusters}>
                  <div className={styles.clusterGroup}>
                    <img className={styles.clusterOrb1} src={xpOrb} alt="" />
                    <img className={styles.clusterOrb2} src={xpOrb} alt="" />
                    <span className={styles.clusterValueXp}>+{finalResult.xp} XP!</span>
                  </div>

                  <div className={styles.clusterGroup}>
                    <img className={styles.clusterPile} src={coinPileMedium} alt="" />
                    <span className={styles.clusterValueVe}>+{finalResult.ve} VEs!</span>
                  </div>
                </div>
              </div>

              {/* Animated Progress Section */}
              <div className={styles.progressSection}>
                <div className={styles.progressTickRow}>
                  <div 
                    className={styles.progressTick}
                    style={{ left: `clamp(20px, ${progressWidth}%, calc(100% - 20px))` }}
                  >
                    <span className={styles.progressTickLabel}>
                      <strong>{currentTotalXP.toLocaleString()}</strong> / {user.requiredXP.toLocaleString()} XP
                    </span>
                    <div className={styles.progressTickArrow} />
                  </div>
                </div>

                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${progressWidth}%` }} />
                </div>

                <p className={styles.progressSubLabel}>
                  Progress to Level {String(user.currentLevel + 1).padStart(2, '0')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className={styles.resultBtnGrid}>
                <button
                  className={styles.playAgainBtn}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setPhase('countdown');
                    setCountdownNum(3);
                    setScore(0);
                    scoreRef.current = 0;
                  }}
                >
                  <RotateCcw size={16} />
                  <span>Play Again</span>
                </button>

                <button
                  className={styles.continueDashboardBtn}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    onClose();
                  }}
                >
                  <span>Continue to Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default XPGame;
