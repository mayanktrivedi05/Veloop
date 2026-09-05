import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './PlayAndEarn.module.css';
import { 
  X, 
  Trophy, 
  RotateCcw, 
  ChevronRight, 
  Timer, 
  Coins, 
  Zap, 
  Volume2, 
  VolumeX, 
  ArrowLeft,
  Info
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function XPGame({ isOpen, onClose, onFinishGame, user, highScore = 92 }) {
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [multiplier, setMultiplier] = useState(1);
  const [multiplierTimer, setMultiplierTimer] = useState(0);
  const [catcherX, setCatcherX] = useState(50);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const itemsRef = useRef([]);
  const gameStateRef = useRef(gameState);
  const scoreRef = useRef(score);
  const multiplierRef = useRef(multiplier);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    multiplierRef.current = multiplier;
  }, [multiplier]);

  const toggleSound = () => {
    soundFx.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const addFloatingText = useCallback((text, x, y, color) => {
    const id = Math.random();
    setFloatingTexts((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== id));
    }, 800);
  }, []);

  const endGame = useCallback(() => {
    setGameState('result');
    onFinishGame(scoreRef.current);
  }, [onFinishGame]);

  const handleStartGame = () => {
    soundFx.playClick();
    setScore(0);
    setTimeLeft(20);
    setMultiplier(1);
    setMultiplierTimer(0);
    itemsRef.current = [];
    setFloatingTexts([]);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, endGame]);

  useEffect(() => {
    if (multiplierTimer <= 0) return;

    const mTimer = setInterval(() => {
      setMultiplierTimer((prev) => {
        if (prev <= 1) {
          setMultiplier(1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(mTimer);
  }, [multiplierTimer]);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setCatcherX((prev) => Math.max(10, prev - 7));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setCatcherX((prev) => Math.min(90, prev + 7));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Touch & Mouse Movement on Game Area
  const handlePointerMove = (e) => {
    if (gameState !== 'playing') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    if (!clientX) return;
    const relativeX = ((clientX - rect.left) / rect.width) * 100;
    setCatcherX(Math.max(10, Math.min(90, relativeX)));
  };

  // Canvas Game Physics Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize canvas
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    let lastSpawn = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      // Spawn items every 350ms
      if (now - lastSpawn > 350) {
        lastSpawn = now;
        const types = [
          { type: 'xp', label: 'XP', color: '#a855f7', value: 10, radius: 18 },
          { type: 've', label: 'V', color: '#f59e0b', value: 15, radius: 16 },
          { type: 'xp_big', label: 'XP+', color: '#38bdf8', value: 25, radius: 22 },
          { type: 'multiplier', label: '2X', color: '#ec4899', value: 0, radius: 18, isMult: true },
        ];
        const chosen = types[Math.floor(Math.random() * types.length)];

        itemsRef.current.push({
          id: Math.random(),
          x: Math.random() * (canvas.width - 60) + 30,
          y: -20,
          speed: Math.random() * 3 + 3.5,
          ...chosen,
        });
      }

      // Basket / Catcher position
      const basketWidth = 90;
      const basketHeight = 35;
      const basketX = (catcherX / 100) * canvas.width - basketWidth / 2;
      const basketY = canvas.height - 55;

      // Update & Render items
      itemsRef.current = itemsRef.current.filter((item) => {
        item.y += item.speed;

        // Collision Check with basket
        const inBasketX = item.x >= basketX - 10 && item.x <= basketX + basketWidth + 10;
        const inBasketY = item.y >= basketY - 15 && item.y <= basketY + basketHeight;

        if (inBasketX && inBasketY) {
          // Caught item!
          if (item.isMult) {
            setMultiplier(2);
            setMultiplierTimer(5);
            soundFx.playMultiplier();
            addFloatingText('+2X MULTIPLIER!', item.x, item.y, '#ec4899');
          } else {
            const gained = item.value * multiplierRef.current;
            setScore((s) => s + gained);
            if (item.type === 've') {
              soundFx.playCoin();
              addFloatingText(`+${gained} VEs`, item.x, item.y, '#fbbf24');
            } else {
              soundFx.playXP();
              addFloatingText(`+${gained} XP`, item.x, item.y, '#38bdf8');
            }
          }
          return false;
        }

        // Draw Item
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = item.color;
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();

        // Inner glowing border
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Text inside item
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, item.x, item.y);
        ctx.restore();

        return item.y < canvas.height + 40;
      });

      if (gameStateRef.current === 'playing') {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, catcherX, addFloatingText]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.gameCard}>
        {/* Top Header */}
        <div className={styles.gameTopBar}>
          <button 
            className={styles.backBtn}
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
          >
            <ArrowLeft size={18} />
          </button>

          <div className={styles.gameHeaderTitle}>
            <h3>XP CATCHER</h3>
            <span className={styles.infoBadge} title="Score high to claim XP!">
              <Info size={13} />
            </span>
          </div>

          <div className={styles.topRightTools}>
            <button className={styles.toolBtn} onClick={toggleSound}>
              {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ---------------- STATE 1: START SCREEN ---------------- */}
        {gameState === 'start' && (
          <div className={styles.startScreen}>
            <div className={styles.startHeroGraphic}>
              <div className={styles.orbitContainer}>
                <div className={`${styles.demoOrb} ${styles.orbXP}`}>XP</div>
                <div className={`${styles.demoOrb} ${styles.orbVE}`}>V</div>
                <div className={`${styles.demoOrb} ${styles.orbMult}`}>2X</div>
                <div className={styles.demoBasket}></div>
              </div>
            </div>

            <div className={styles.startInfo}>
              <h2>Catch XP Orbs & Coins</h2>
              <p className={styles.startDesc}>
                Move your net left and right to catch falling XP and VE coins. Activate the 2X Multiplier to skyrocket your score!
              </p>

              <div className={styles.rulesGrid}>
                <div className={styles.ruleItem}>
                  <Timer size={16} className={styles.ruleIcon} />
                  <span>20s Rapid Round</span>
                </div>
                <div className={styles.ruleItem}>
                  <Zap size={16} className={styles.ruleIcon} />
                  <span>High Score: <strong>{highScore} pts</strong></span>
                </div>
                <div className={styles.ruleItem}>
                  <Coins size={16} className={styles.ruleIcon} />
                  <span>Earn up to <strong>+50 XP</strong></span>
                </div>
              </div>
            </div>

            <button className={styles.startBtn} onClick={handleStartGame}>
              <span>Start Challenge</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ---------------- STATE 2: ACTIVE GAMEPLAY ---------------- */}
        {gameState === 'playing' && (
          <div 
            className={styles.playArena}
            onPointerMove={handlePointerMove}
            onTouchMove={handlePointerMove}
          >
            {/* Live Stats Bar */}
            <div className={styles.statsOverlay}>
              <div className={styles.statPill}>
                <Timer size={15} color="#38bdf8" />
                <span className={styles.timeValue}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
              </div>

              {multiplier > 1 && (
                <div className={styles.multiplierBadge}>
                  🔥 {multiplier}X ACTIVE ({multiplierTimer}s)
                </div>
              )}

              <div className={styles.statPill}>
                <span className={styles.scoreLabel}>SCORE</span>
                <span className={styles.scoreValue}>{score}</span>
              </div>
            </div>

            {/* Canvas for falling items */}
            <canvas ref={canvasRef} className={styles.gameCanvas} />

            {/* Floating text indicators */}
            {floatingTexts.map((ft) => (
              <div 
                key={ft.id} 
                className={styles.floatingTag}
                style={{ left: ft.x, top: ft.y, color: ft.color }}
              >
                {ft.text}
              </div>
            ))}

            {/* Interactive Catcher Basket */}
            <div 
              className={styles.catcherNet}
              style={{ left: `${catcherX}%` }}
            >
              <div className={styles.netRing}>
                <div className={styles.netMesh}></div>
              </div>
            </div>

            {/* Bottom info tip */}
            <div className={styles.touchHint}>
              <span>👈 Drag or use Arrow Keys to Move 👉</span>
            </div>
          </div>
        )}

        {/* ---------------- STATE 3: RESULT SCREEN ---------------- */}
        {gameState === 'result' && (
          <div className={styles.resultScreen}>
            <div className={styles.medalGraphic}>
              <div className={styles.medalGlow}></div>
              <div className={styles.crestCircle}>
                <Trophy size={42} className={styles.trophyHeroIcon} />
              </div>
              <div className={styles.ribbonTag}>OUTSTANDING!</div>
            </div>

            <h2 className={styles.resultTitle}>CHALLENGE COMPLETE!</h2>

            {/* Score Box */}
            <div className={styles.finalScoreBox}>
              <span className={styles.finalScoreLabel}>FINAL SCORE</span>
              <div className={styles.scoreNumberRow}>
                <span className={styles.bigScore}>{score}</span>
                {score >= highScore && (
                  <span className={styles.newBestBadge}>New Best!</span>
                )}
              </div>
            </div>

            {/* Earned Rewards Preview */}
            <div className={styles.earnedGrid}>
              <div className={styles.earnedItem}>
                <span className={styles.earnedValue}>+{Math.max(15, Math.floor(score * 0.35))} XP</span>
                <span className={styles.earnedLabel}>Experience</span>
              </div>
              <div className={styles.earnedItem}>
                <span className={styles.earnedValue}>+{Math.max(5, Math.floor(score * 0.15))} VEs</span>
                <span className={styles.earnedLabel}>Your Reward</span>
              </div>
            </div>

            {/* Progress Bar Update */}
            <div className={styles.resultProgress}>
              <div className={styles.progLabels}>
                <span>Level 0{user.currentLevel}</span>
                <span>{user.currentXP.toLocaleString()} / {user.requiredXP.toLocaleString()} XP</span>
                <span>Level 0{user.currentLevel + 1}</span>
              </div>
              <div className={styles.progTrack}>
                <div 
                  className={styles.progFill} 
                  style={{ width: `${Math.min(100, (user.currentXP / user.requiredXP) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.resultActions}>
              <button className={styles.playAgainBtn} onClick={handleStartGame}>
                <RotateCcw size={16} />
                <span>Play Again</span>
              </button>
              <button className={styles.backDashBtn} onClick={onClose}>
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
