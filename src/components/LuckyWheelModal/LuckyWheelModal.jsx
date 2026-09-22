import React, { useState, useRef } from 'react';
import styles from './LuckyWheelModal.module.css';
import { X, Sparkles, Trophy, Gem, Flame, RefreshCw, Zap, Gift, Check } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import safeImg from '../../assets/safe/safe-2.svg';
import xpCoin from '../../assets/coins/xp-1.svg';
import veCoin from '../../assets/coins/ve.svg';
import gemCoin from '../../assets/coins/gem.svg';

const WHEEL_PRIZES = [
  { label: '+50 XP', value: 50, type: 'xp', color: '#38bdf8', icon: Zap },
  { label: '+15 VEs', value: 15, type: 've', color: '#f59e0b', icon: Trophy },
  { label: '+5 Gems', value: 5, type: 'gem', color: '#10b981', icon: Gem },
  { label: '+100 XP', value: 100, type: 'xp', color: '#a855f7', icon: Zap },
  { label: '2X Boost', value: 2, type: 'boost', color: '#ec4899', icon: Flame },
  { label: '+25 VEs', value: 25, type: 've', color: '#fbbf24', icon: Trophy },
  { label: '+150 XP', value: 150, type: 'xp', color: '#00f0ff', icon: Sparkles },
  { label: 'MYSTERY', value: 80, type: 'mystery', color: '#ffd700', icon: Gift },
];

export function LuckyWheelModal({ isOpen, onClose, onRewardWon, spinsLeft = 2 }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);
  const [activeTab, setActiveTab] = useState('wheel'); // 'wheel' | 'chest'
  const [chestOpened, setChestOpened] = useState(false);
  const [mysteryReward, setMysteryReward] = useState(null);

  const wheelRef = useRef(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setWonPrize(null);
    soundFx.playStreak();

    // Random slices
    const prizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const sliceAngle = 360 / WHEEL_PRIZES.length;
    // 5 full rotations plus target
    const randomOffset = 360 * 5 + (360 - (prizeIndex * sliceAngle + sliceAngle / 2));
    const newRotation = rotation + randomOffset;
    setRotation(newRotation);

    // Audio tick simulation
    const tickInterval = setInterval(() => {
      soundFx.playSpinTick();
    }, 120);

    setTimeout(() => {
      clearInterval(tickInterval);
    }, 2800);

    setTimeout(() => {
      setSpinning(false);
      const prize = WHEEL_PRIZES[prizeIndex];
      setWonPrize(prize);
      soundFx.playLevelUp();

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#ffd700', '#38bdf8', '#a855f7', '#10b981'],
        });
      } catch {
        // Fallback
      }

      if (onRewardWon) {
        onRewardWon(prize);
      }
    }, 3600);
  };

  const handleOpenChest = () => {
    if (chestOpened) return;
    setChestOpened(true);
    soundFx.playLevelUp();
    const rewards = [
      { xp: 120, ves: 30, gems: 5 },
      { xp: 200, ves: 50, gems: 10 },
      { xp: 80, ves: 25, gems: 3 },
    ];
    const chosen = rewards[Math.floor(Math.random() * rewards.length)];
    setMysteryReward(chosen);

    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#ffd700', '#f59e0b', '#38bdf8'],
      });
    } catch {
      // Fallback
    }

    if (onRewardWon) {
      onRewardWon({ type: 'chest', ...chosen });
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleRow}>
            <div className={styles.headerIconCircle}>
              <Trophy size={18} color="#ffd700" />
            </div>
            <div>
              <h3 className={styles.headerModalTitle}>LUCKY VAULT & WHEEL</h3>
              <p className={styles.headerModalSub}>Spin & Unlock Legendary Rewards Daily</p>
            </div>
          </div>

          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className={styles.tabBar}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'wheel' ? styles.tabActive : ''}`}
            onClick={() => {
              soundFx.playClick();
              setActiveTab('wheel');
            }}
          >
            <Sparkles size={15} />
            <span>Fortune Wheel</span>
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'chest' ? styles.tabActive : ''}`}
            onClick={() => {
              soundFx.playClick();
              setActiveTab('chest');
            }}
          >
            <Gift size={15} />
            <span>Mystery Vault</span>
          </button>
        </div>

        {/* Tab Content: Wheel */}
        {activeTab === 'wheel' && (
          <div className={styles.wheelArea}>
            <div className={styles.spinsBadge}>
              <span>Spins Available: <strong>{spinsLeft} Free</strong></span>
            </div>

            {/* Wheel Canvas / Container */}
            <div className={styles.wheelContainer}>
              <div className={styles.wheelPointer}>▼</div>
              <div 
                ref={wheelRef}
                className={styles.wheelDisc}
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 3.5s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none'
                }}
              >
                {WHEEL_PRIZES.map((prize, idx) => {
                  const angle = (360 / WHEEL_PRIZES.length) * idx;
                  const Icon = prize.icon;
                  return (
                    <div 
                      key={idx}
                      className={styles.wheelSlice}
                      style={{ 
                        transform: `rotate(${angle}deg)`,
                        borderTopColor: prize.color 
                      }}
                    >
                      <div className={styles.sliceContent}>
                        <Icon size={14} color={prize.color} />
                        <span style={{ color: prize.color }}>{prize.label}</span>
                      </div>
                    </div>
                  );
                })}
                <div className={styles.wheelCenterHub}>
                  <Sparkles size={20} color="#ffd700" />
                </div>
              </div>
            </div>

            {/* Spin Result Banner */}
            {wonPrize && (
              <div className={styles.prizeWonBanner}>
                <Sparkles size={18} color="#ffd700" />
                <span>You Won <strong>{wonPrize.label}</strong>! Added to your account.</span>
              </div>
            )}

            {/* Spin CTA Button */}
            <button 
              className={styles.spinButton}
              onClick={handleSpin}
              disabled={spinning}
            >
              <RefreshCw size={18} className={spinning ? styles.spinIconAnim : ''} />
              <span>{spinning ? 'Spinning the Wheel...' : 'SPIN FOR FREE'}</span>
            </button>
          </div>
        )}

        {/* Tab Content: Mystery Chest */}
        {activeTab === 'chest' && (
          <div className={styles.chestArea}>
            <p className={styles.chestPrompt}>
              Tap the Ancient VeLoop Vault to crack open exclusive gems, coins & XP boosts!
            </p>

            <div 
              className={`${styles.mysteryChestGraphic} ${chestOpened ? styles.chestActiveOpened : ''}`}
              onClick={handleOpenChest}
            >
              <div className={styles.chestAuraGlow}></div>
              <div className={styles.vaultIconWrapper}>
                <img src={safeImg} alt="Vault Safe" className={styles.safeImgGraphic} />
              </div>
              <div className={styles.sparkleFloating}>✨</div>
              <div className={styles.sparkleFloating2}>💎</div>
            </div>

            {chestOpened && mysteryReward ? (
              <div className={styles.chestRewardBox}>
                <div className={styles.rewardGrid}>
                  <div className={styles.rewardChip}>
                    <img src={xpCoin} alt="XP" className={styles.modalPrizeCoin} />
                    <span>+{mysteryReward.xp} XP</span>
                  </div>
                  <div className={styles.rewardChip}>
                    <img src={veCoin} alt="VEs" className={styles.modalPrizeCoin} />
                    <span>+{mysteryReward.ves} VEs</span>
                  </div>
                  <div className={styles.rewardChip}>
                    <img src={gemCoin} alt="Gems" className={styles.modalPrizeCoin} />
                    <span>+{mysteryReward.gems} Gems</span>
                  </div>
                </div>
                <p className={styles.rewardClaimedText}>🎉 Vault Loot Added to Your Balance!</p>
              </div>
            ) : (
              <button className={styles.openChestBtn} onClick={handleOpenChest}>
                <Sparkles size={18} />
                <span>UNLOCK MYSTERY VAULT</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
