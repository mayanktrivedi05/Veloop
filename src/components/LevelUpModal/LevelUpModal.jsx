import React, { useEffect } from 'react';
import styles from './LevelUpModal.module.css';
import { Sparkles, BarChart2, Target, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

export function LevelUpModal({ isOpen, onClaim, levelData, user }) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 100,
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
          <Sparkles size={18} className={`${styles.star} ${styles.star1}`} />
          <Sparkles size={14} className={`${styles.star} ${styles.star2}`} />
          <Sparkles size={20} className={`${styles.star} ${styles.star3}`} />
        </div>

        {/* Title */}
        <div className={styles.titleSection}>
          <h2 className={styles.levelUpHeading}>LEVEL UP!</h2>
          <p className={styles.reachedText}>You've reached</p>
        </div>

        {/* 3D Pedestal Stage & Gold Hexagon Shield */}
        <div className={styles.pedestalStage}>
          <div className={styles.shieldWrapper}>
            <div className={styles.shieldAura}></div>
            <div className={styles.shieldShape}>
              <span className={styles.badgeLabel}>LEVEL</span>
              <span className={styles.badgeNum}>0{currentLevel}</span>
            </div>
            <div className={styles.laurelWingLeft}>🌿</div>
            <div className={styles.laurelWingRight}>🌿</div>
          </div>
          <div className={styles.pedestalBase}>
            <div className={styles.pedestalTopRing}></div>
            <div className={styles.pedestalColumn}></div>
          </div>
        </div>

        {/* Unlocked Rewards Row */}
        <div className={styles.rewardsRow}>
          <div className={styles.rewardPill}>
            <span className={styles.rewardIcon}>🪙</span>
            <span className={styles.rewardVal}>+{rewardVEs} VEs</span>
          </div>

          <div className={styles.rewardPill}>
            <span className={styles.rewardIcon}>💎</span>
            <span className={styles.rewardVal}>+{rewardGems} Gems</span>
          </div>
        </div>

        {/* Perks List (Screen 5) */}
        <div className={styles.perksSection}>
          <div className={styles.perkList}>
            <div className={styles.perkRow}>
              <BarChart2 size={16} color="#38bdf8" />
              <span>Higher daily XP limit</span>
            </div>
            <div className={styles.perkRow}>
              <Target size={16} color="#f59e0b" />
              <span>Access to new challenges</span>
            </div>
            <div className={styles.perkRow}>
              <Gift size={16} color="#ec4899" />
              <span>Better reward opportunities</span>
            </div>
          </div>
        </div>

        {/* Claim Rewards Button */}
        <button className={styles.claimBtn} onClick={onClaim}>
          <span>Claim Rewards</span>
        </button>
      </div>
    </div>
  );
}

