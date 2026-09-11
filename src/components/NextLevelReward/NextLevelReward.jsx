import React from 'react';
import styles from './NextLevelReward.module.css';
import { ChevronRight, Gift } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function NextLevelReward({ user, onOpenLevelModal, onOpenLuckyWheel }) {
  return (
    <div className={styles.vaultRewardCard}>
      {/* Crown Aura & Radiance */}
      <div className={styles.crownAuraBg}>👑</div>
      <div className={styles.goldGlowRadial}></div>

      {/* Left Column: Text & Action Buttons */}
      <div className={styles.leftCol}>
        <div className={styles.vaultTagRow}>
          <span className={styles.crownTagIcon}>👑</span>
          <span className={styles.vaultTagText}>
            LEVEL 0{user.currentLevel || 5} REWARDS VAULT
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

      {/* Right Column: 3D Gold Treasure Chest overflowing with VE Coins and Blue Gems */}
      <div className={styles.rightCol}>
        <div 
          className={styles.chestContainer}
          onClick={() => {
            soundFx.playStreak();
            if (onOpenLuckyWheel) onOpenLuckyWheel();
            else onOpenLevelModal();
          }}
          title="Click to unlock vault!"
        >
          {/* Overflowing gems and coins */}
          <div className={styles.floatingParticles}>
            <span className={`${styles.gem} ${styles.gem1}`}>💎</span>
            <span className={`${styles.gem} ${styles.gem2}`}>💎</span>
            <span className={`${styles.coin} ${styles.coin1}`}>🪙</span>
            <span className={`${styles.coin} ${styles.coin2}`}>🪙</span>
            <span className={`${styles.sparkle} ${styles.sparkle1}`}>✨</span>
          </div>

          {/* 3D Realistic Chest Graphic */}
          <div className={styles.chestGraphicBox}>
            <div className={styles.chestLidOpen}></div>
            <div className={styles.chestLootInside}>
              <span className={styles.innerGem}>💎</span>
              <span className={styles.innerCoin}>🪙</span>
            </div>
            <div className={styles.chestMainBody}>
              <div className={styles.chestCrownEmblem}>👑</div>
              <div className={styles.chestGoldTrim}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

