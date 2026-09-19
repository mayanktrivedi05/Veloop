import React, { useEffect } from 'react';
import styles from './LevelUpModal.module.css';
import { Sparkles, BarChart2, Target, Gift, Trophy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getBadgeSrc } from '../../assets/badges/index.js';
import veIcon from '../../assets/coins/ve.svg';
import gemIcon from '../../assets/coins/gem.svg';

export function LevelUpModal({ isOpen, onClose, onClaim, levelData, user }) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.5 },
          colors: ['#38bdf8', '#ffd700', '#a855f7', '#10b981', '#ec4899'],
        });
      } catch {
        // Fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentLevel = user.currentLevel || 5;
  const rewardVEs = levelData?.rewardVEs || 500;
  const rewardGems = levelData?.rewardGems || 25;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.celebrationCard} onClick={(e) => e.stopPropagation()}>
        {/* Animated Background Radiance */}
        <div className={styles.radianceGlow}></div>
        <div className={styles.starCluster}>
          <Sparkles size={20} className={`${styles.star} ${styles.star1}`} />
          <Sparkles size={16} className={`${styles.star} ${styles.star2}`} />
          <Sparkles size={22} className={`${styles.star} ${styles.star3}`} />
        </div>

        {/* Title */}
        <div className={styles.titleSection}>
          <span className={styles.victoryTag}>CONGRATULATIONS</span>
          <h2 className={styles.levelUpHeading}>LEVEL UP ACHIEVED!</h2>
          <p className={styles.reachedText}>You have ascended to tier rank</p>
        </div>

        {/* 3D Shield Pedestal Stage with Official Badge */}
        <div className={styles.pedestalStage}>
          <div className={styles.shieldWrapper}>
            <div className={styles.shieldAura}></div>
            <img 
              className={styles.modalBadgeImg}
              src={getBadgeSrc(currentLevel)} 
              alt={`Level ${currentLevel}`} 
            />
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
            <img className={styles.rewardTokenImg} src={veIcon} alt="VEs" />
            <div className={styles.rewardTextCol}>
              <span className={styles.rewardVal}>+{rewardVEs} VEs</span>
              <span className={styles.rewardSub}>Token Bonus</span>
            </div>
          </div>

          <div className={styles.rewardPill}>
            <img className={styles.rewardTokenImg} src={gemIcon} alt="Gems" />
            <div className={styles.rewardTextCol}>
              <span className={styles.rewardVal}>+{rewardGems} Gems</span>
              <span className={styles.rewardSub}>Vault Gems</span>
            </div>
          </div>
        </div>

        {/* Perks Section */}
        <div className={styles.perksSection}>
          <div className={styles.perkHeader}>
            <Trophy size={14} color="var(--accent-gold)" />
            <span>UNLOCKED LEVEL 0{currentLevel} PERKS</span>
          </div>
          <div className={styles.perkList}>
            <div className={styles.perkRow}>
              <BarChart2 size={16} color="var(--accent-primary)" />
              <span>Higher daily XP limit (Up to 1,500 XP/day)</span>
            </div>
            <div className={styles.perkRow}>
              <Target size={16} color="var(--accent-gold)" />
              <span>Access to exclusive Fortune Wheel multipliers</span>
            </div>
            <div className={styles.perkRow}>
              <Gift size={16} color="#ec4899" />
              <span>VIP Weekly Reward Drops and reduced fees</span>
            </div>
          </div>
        </div>

        {/* Claim Button */}
        <button className={styles.claimBtn} onClick={onClaim}>
          <Sparkles size={18} />
          <span>CLAIM REWARDS & ASCEND</span>
        </button>
      </div>
    </div>
  );
}
