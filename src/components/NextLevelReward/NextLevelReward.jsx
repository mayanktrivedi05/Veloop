import React from 'react';
import styles from './NextLevelReward.module.css';
import { ChevronRight, Gift, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';
import safeIcon from '../../assets/safe/safe-2.svg';
import gemIcon from '../../assets/coins/gem.svg';
import coinPileHigh from '../../assets/pile-of-coins/high.svg';
import veIcon from '../../assets/coins/ve.svg';

export function NextLevelReward({ user, onOpenLevelModal, onOpenLuckyWheel }) {
  const currentLevel = user.currentLevel || 5;

  return (
    <div className={styles.vaultRewardCard}>
      {/* Background Radiance & Lighting */}
      <div className={styles.goldGlowRadial}></div>
      <div className={styles.meshAura}></div>

      {/* Left Column: Text & Action Buttons */}
      <div className={styles.leftCol}>
        <div className={styles.vaultTagRow}>
          <span className={styles.crownTagIcon}>👑</span>
          <span className={styles.vaultTagText}>
            LEVEL 0{currentLevel} REWARDS VAULT
          </span>
        </div>

        <h3 className={styles.vaultHeading}>+500 VEs & 25 Gems</h3>
        
        <p className={styles.vaultSubtext}>
          Unlocks exclusive high-tier multipliers, XP mini-game bonus mode, and daily spin tokens.
        </p>

        <div className={styles.buttonsRow}>
          <button 
            className={styles.viewPerksBtn}
            onClick={() => {
              soundFx.playClick();
              onOpenLevelModal();
            }}
          >
            <span>View Perks</span>
            <ChevronRight size={15} />
          </button>

          <button 
            className={styles.luckyVaultBtn}
            onClick={() => {
              soundFx.playStreak();
              if (onOpenLuckyWheel) onOpenLuckyWheel();
            }}
          >
            <Gift size={15} />
            <span>Lucky Vault</span>
          </button>
        </div>
      </div>

      {/* Right Column: 3D Vault Safe overflowing with Gems & Coins */}
      <div className={styles.rightCol}>
        <div 
          className={styles.vaultGraphicContainer}
          onClick={() => {
            soundFx.playStreak();
            if (onOpenLuckyWheel) onOpenLuckyWheel();
            else onOpenLevelModal();
          }}
          title="Click to explore rewards!"
        >
          {/* Floating Gems & Coin Assets */}
          <div className={styles.floatingLoot}>
            <img className={`${styles.lootGem} ${styles.lootGem1}`} src={gemIcon} alt="Gem" />
            <img className={`${styles.lootGem} ${styles.lootGem2}`} src={gemIcon} alt="Gem" />
            <img className={`${styles.lootCoin} ${styles.lootCoin1}`} src={veIcon} alt="VE" />
            <img className={styles.lootPile} src={coinPileHigh} alt="Coin Pile" />
          </div>

          {/* 3D Official Vault Safe */}
          <img className={styles.vaultSafeArt} src={safeIcon} alt="Rewards Vault Safe" />
        </div>
      </div>
    </div>
  );
}

export default NextLevelReward;
