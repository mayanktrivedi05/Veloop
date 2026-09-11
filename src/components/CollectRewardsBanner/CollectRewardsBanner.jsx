import React from 'react';
import styles from './CollectRewardsBanner.module.css';
import { ChevronRight, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function CollectRewardsBanner({ onOpenRewards }) {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerGlow}></div>
      <div className={styles.starsCluster}>
        <span className={`${styles.star} ${styles.star1}`}>✨</span>
        <span className={`${styles.star} ${styles.star2}`}>💎</span>
        <span className={`${styles.star} ${styles.star3}`}>🪙</span>
      </div>

      {/* 3D Open Treasure Chest Graphic */}
      <div className={styles.chestArea}>
        <div className={styles.chestGraphic}>
          <div className={styles.chestLid}></div>
          <div className={styles.chestBody}>
            <div className={styles.chestLock}></div>
            <div className={styles.goldCoinsHeap}>🪙🪙</div>
          </div>
        </div>
      </div>

      {/* Center Text */}
      <div className={styles.textArea}>
        <h4 className={styles.bannerTitle}>Collect VEs, Unlock Rewards</h4>
        <p className={styles.bannerSub}>Play • Earn • Redeem</p>
      </div>

      {/* Explore Button */}
      <button 
        className={styles.exploreBtn}
        onClick={() => {
          soundFx.playClick();
          if (onOpenRewards) onOpenRewards();
        }}
      >
        <span>Explore Rewards</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
