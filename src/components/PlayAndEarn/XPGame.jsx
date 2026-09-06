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
  Star
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function XPGame({ isOpen, onClose, onFinishGame, user, highScore = 92, initialMode = 'start' }) {
  const [gameState, setGameState] = useState(initialMode);
  const [score, setScore] = useState(initialMode === 'result' ? 92 : 0);
  const [timeLeft, setTimeLeft] = useState(18);
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
    if (isOpen) {
      setGameState(initialMode);
      if (initialMode === 'result') {
        setScore(92);
      } else if (initialMode === 'playing') {
        setScore(120);
        setTimeLeft(18);
      }
    }
  }, [isOpen, initialMode]);

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
    }, 700);
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
          setTimeout(() => {
            endGame();
          }, 0);
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
        setCatcherX((prev) => Math.max(12, prev - 8));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setCatcherX((prev) => Math.min(88, prev + 8));
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
    setCatcherX(Math.max(12, Math.min(88, relativeX)));
  };

  // Canvas Game Physics Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    let lastSpawn = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      if (now - lastSpawn > 320) {
        lastSpawn = now;
        const types = [
          { type: 'xp', label: 'XP', color: '#a855f7', value: 10, radius: 17 },
          { type: 've', label: 'V', color: '#f59e0b', value: 15, radius: 15 },
          { type: 'gem', label: '💎', color: '#10b981', value: 20, radius: 16 },
          { type: 'xp_big', label: 'XP', color: '#c084fc', value: 25, radius: 20 },
          { type: 'mult', label: '2X', color: '#ec4899', value: 0, radius: 16, isMult: true },
        ];
        const chosen = types[Math.floor(Math.random() * types.length)];

        itemsRef.current.push({
          id: Math.random(),
          x: Math.random() * (canvas.width - 60) + 30,
          y: -20,
          speed: Math.random() * 2.5 + 3.2,
          ...chosen,
        });
      }

      // Basket position
      const basketWidth = 84;
      const basketHeight = 35;
      const basketX = (catcherX / 100) * canvas.width - basketWidth / 2;
      const basketY = canvas.height - 60;

      // Render & collision
      itemsRef.current = itemsRef.current.filter((item) => {
        item.y += item.speed;

        const inBasketX = item.x >= basketX - 10 && item.x <= basketX + basketWidth + 10;
        const inBasketY = item.y >= basketY - 12 && item.y <= basketY + basketHeight;

        if (inBasketX && inBasketY) {
          if (item.isMult) {
            setMultiplier(2);
            setMultiplierTimer(5);
            soundFx.playMultiplier();
            addFloatingText('2X ACTIVE!', item.x, item.y, '#ec4899');
          } else {
            const gained = item.value * multiplierRef.current;
            setScore((s) => s + gained);
            if (item.type === 've') {
              soundFx.playCoin();
              addFloatingText(`+${gained} VEs`, item.x, item.y, '#fbbf24');
            } else {
              soundFx.playXP();
              addFloatingText(`+${gained} XP`, item.x, item.y, '#c084fc');
            }
          }
          return false;
        }

        // Draw item
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = item.color;
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, item.x, item.y);
        ctx.restore();

        return item.y < canvas.height + 30;
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
        {/* ---------------- STATE 1: START SCREEN ---------------- */}
        {gameState === 'start' && (
          <div className={styles.startScreen}>
            <div className={styles.gameTopBar}>
              <button 
                className={styles.backBtn}
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
              >
                <ArrowLeft size={20} />
              </button>

              <div className={styles.gameHeaderTitle}>
                <h3>XP CATCHER</h3>
                <span className={styles.infoBadge} title="Catch XP to level up!">
                  <Info size={14} />
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

            <div className={styles.startBody}>
              <p className={styles.gameSubtitle}>
                Catch XP orbs & coins. Score high for better rewards!
              </p>

              <div className={styles.startHeroGraphic}>
                <div className={styles.orbitContainer}>
                  <div className={`${styles.demoOrb} ${styles.orbXP}`}>XP</div>
                  <div className={`${styles.demoOrb} ${styles.orbVE}`}>V</div>
                  <div className={`${styles.demoOrb} ${styles.orbGem}`}>💎</div>
                  <div className={styles.demoBasket}></div>
                </div>
              </div>

              <div className={styles.rulesList}>
                <div className={styles.rulePill}>⏱️ 20 Seconds Fast Challenge</div>
                <div className={styles.rulePill}>🏆 High Score: <strong>{highScore} pts</strong></div>
                <div className={styles.rulePill}>✨ Earn up to <strong>+50 XP</strong> & <strong>+15 VEs</strong></div>
              </div>

              <button className={styles.startBtn} onClick={handleStartGame}>
                <span>Play Now</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ---------------- STATE 2: ACTIVE GAMEPLAY (Screen 2) ---------------- */}
        {gameState === 'playing' && (
          <div 
            className={styles.playArena}
            onPointerMove={handlePointerMove}
            onTouchMove={handlePointerMove}
          >
            {/* Screen 2 Top Bar */}
            <div className={styles.playHeaderBar}>
              <button 
                className={styles.backBtn}
                onClick={() => {
                  soundFx.playClick();
                  setGameState('start');
                }}
              >
                <ArrowLeft size={20} />
              </button>

              <div className={styles.gameHeaderTitle}>
                <h3>XP CATCHER</h3>
                <Info size={14} className={styles.infoBadge} />
              </div>

              <div className={styles.timerPill}>
                <Timer size={14} />
                <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
              </div>
            </div>

            <p className={styles.playSubtitle}>
              Catch XP orbs & coins<br/>Score high for better rewards!
            </p>

            {/* Canvas */}
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

            {/* Net / Basket at bottom */}
            <div 
              className={styles.catcherNet}
              style={{ left: `${catcherX}%` }}
            >
              <div className={styles.netRim}>
                <div className={styles.netMesh}></div>
              </div>
            </div>

            {/* Bottom Screen 2 Status Bar */}
            <div className={styles.playFooterBar}>
              <div className={styles.scoreContainer}>
                <span className={styles.scoreLabel}>YOUR SCORE</span>
                <span className={styles.scoreValue}>{score}</span>
              </div>

              <div className={styles.footerBadges}>
                <div className={styles.veBadge}>
                  <span className={styles.veBadgeIcon}>V</span>
                  <span>+5 VEs</span>
                </div>
                <div className={`${styles.multBadge} ${multiplier > 1 ? styles.multActive : ''}`}>
                  <span>⚡ 2X Multiplier</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- STATE 3: RESULT SCREEN (Screen 3) ---------------- */}
        {gameState === 'result' && (
          <div className={styles.resultScreen}>
            <div className={styles.resultTopBar}>
              <button 
                className={styles.backBtn}
                onClick={() => setGameState('start')}
              >
                <ArrowLeft size={20} />
              </button>
              <button 
                className={styles.toolBtn}
                onClick={() => soundFx.playClick()}
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Shield Laurel Wreath Graphic */}
            <div className={styles.resultHero}>
              <div className={styles.laurelContainer}>
                <div className={styles.shieldGold}>
                  <Star size={36} className={styles.goldStarIcon} fill="#fbbf24" />
                </div>
                <div className={styles.laurelLeavesLeft}>🌿</div>
                <div className={styles.laurelLeavesRight}>🌿</div>
              </div>

              <h2 className={styles.completeTitle}>CHALLENGE COMPLETE!</h2>
              <span className={styles.completeSub}>Outstanding!</span>
            </div>

            {/* Score Box */}
            <div className={styles.finalScoreBox}>
              <span className={styles.finalScoreLabel}>FINAL SCORE</span>
              <div className={styles.finalScoreRow}>
                <span className={styles.bigScore}>{score}</span>
                <span className={styles.newBestBadge}>New Best!</span>
              </div>
            </div>

            {/* Reward Cards */}
            <div className={styles.rewardCardsGrid}>
              <div className={styles.rewardCardItem}>
                <span className={styles.rcValue}>+{Math.max(15, Math.floor(score * 0.35))} XP</span>
                <span className={styles.rcLabel}>Experience</span>
              </div>
              <div className={styles.rewardCardItem}>
                <span className={styles.rcValue}>+{Math.max(5, Math.floor(score * 0.15))} VEs</span>
                <span className={styles.rcLabel}>Your Reward</span>
              </div>
            </div>

            {/* Level Progression Bar */}
            <div className={styles.resultProgress}>
              <div className={styles.progLabels}>
                <span>Level 0{user.currentLevel}</span>
                <span>Level 0{user.currentLevel + 1}</span>
              </div>
              <div className={styles.progTrack}>
                <div 
                  className={styles.progFill} 
                  style={{ width: `${Math.min(100, (user.currentXP / user.requiredXP) * 100)}%` }}
                ></div>
              </div>
              <span className={styles.progRatio}>
                {user.currentXP.toLocaleString()} / {user.requiredXP.toLocaleString()} XP
              </span>
            </div>

            {/* Buttons */}
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

