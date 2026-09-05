import React, { useEffect } from 'react';
import styles from './LevelUpModal.module.css';
import { Sparkles, Gem, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export function LevelUpModal({ isOpen, onClaim, levelData, user }) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#38bdf8', '#f59e0b', '#a855f7', '#10b981'],
        });
      } catch {
        // Fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentLevel = user.currentLevel;
  const rewardVEs = levelData?.rewardVEs || 500;
  const rewardGems = levelData?.rewardGems || 25;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.celebrationCard}>
        {/* Animated Background Radiance */}
        <div className={styles.radianceGlow}></div>
        <div className={styles.starCluster}>
          <Sparkles size={20} className={`${styles.star} ${styles.star1}`} />
          <Sparkles size={16} className={`${styles.star} ${styles.star2}`} />
          <Sparkles size={22} className={`${styles.star} ${styles.star3}`} />
        </div>

        {/* Title */}
        <div className={styles.titleSection}>
          <span className={styles.levelUpSubtitle}>CONGRATULATIONS!</span>
          <h2 className={styles.levelUpHeading}>LEVEL UP!</h2>
          <p className={styles.reachedText}>You've reached</p>
        </div>

        {/* Big Golden Hexagon Shield */}
        <div className={styles.shieldWrapper}>
          <div className={styles.shieldAura}></div>
          <div className={styles.shieldShape}>
            <span className={styles.badgeLabel}>LEVEL</span>
            <span className={styles.badgeNum}>0{currentLevel}</span>
          </div>
        </div>

        {/* Unlocked Rewards Row */}
        <div className={styles.rewardsRow}>
          <div className={styles.rewardPill}>
            <div className={styles.coinGraphic}>V</div>
            <div className={styles.rewardTextCol}>
              <span className={styles.rewardVal}>+{rewardVEs} VEs</span>
              <span className={styles.rewardSub}>Bonus Coins</span>
            </div>
          </div>

          <div className={styles.rewardPill}>
            <div className={styles.gemGraphic}>
              <Gem size={18} />
            </div>
            <div className={styles.rewardTextCol}>
              <span className={styles.rewardVal}>+{rewardGems} Gems</span>
              <span className={styles.rewardSub}>Rare Gems</span>
            </div>
          </div>
        </div>

        {/* Perks Unlocked */}
        <div className={styles.perksSection}>
          <span className={styles.perksTitle}>NEW PERKS UNLOCKED</span>
          <div className={styles.perkList}>
            <div className={styles.perkRow}>
              <div className={styles.checkCircle}>
                <Check size={12} />
              </div>
              <span>Higher daily XP limit (Up to 1,500 XP)</span>
            </div>
            <div className={styles.perkRow}>
              <div className={styles.checkCircle}>
                <Check size={12} />
              </div>
              <span>Access to exclusive XP Catcher Bonus Mode</span>
            </div>
            <div className={styles.perkRow}>
              <div className={styles.checkCircle}>
                <Check size={12} />
              </div>
              <span>Better multiplier reward opportunities (2X - 5X)</span>
            </div>
          </div>
        </div>

        {/* Claim Rewards Button */}
        <button className={styles.claimBtn} onClick={onClaim}>
          <span>Claim Rewards</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
