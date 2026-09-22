import React from 'react';
import styles from './CollectRewardsBanner.module.css';
import { ChevronRight, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';
import safeIcon from '../../assets/safe/safe-1.svg';
import goldCoin from '../../assets/coins/gold.svg';
import gemIcon from '../../assets/coins/gem.svg';

export function CollectRewardsBanner({ onOpenRewards }) {
  return (
    <div className={styles.bannerContainer}>
      {/* Dynamic Ambient Glow */}
      <div className={styles.bannerGlow}></div>
      <div className={styles.shimmerRay}></div>

      {/* 3D Treasure Safe Artwork with Floating Coins */}
      <div className={styles.safeVisualArea}>
        <img className={styles.safeArt} src={safeIcon} alt="Treasure Safe" />
        <img className={`${styles.floatingCoin} ${styles.coin1}`} src={goldCoin} alt="Gold Coin" />
        <img className={`${styles.floatingGem} ${styles.gem1}`} src={gemIcon} alt="Gem" />
      </div>

      {/* Center Text */}
      <div className={styles.textArea}>
        <div className={styles.badgePill}>
          <Sparkles size={12} className={styles.sparkleIcon} />
          <span>REWARDS VAULT</span>
        </div>
        <h4 className={styles.bannerTitle}>Collect VEs, Unlock Rewards</h4>
        <p className={styles.bannerSub}>Play • Earn Tasks • Redeem VIP Perks</p>
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
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

export default CollectRewardsBanner;
