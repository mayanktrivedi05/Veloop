import React from 'react';
import styles from './NextLevelReward.module.css';
import { ChevronRight, Sparkles, Gift, Trophy } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function NextLevelReward({ user, onOpenLevelModal, onOpenLuckyWheel }) {
  return (
    <div className={styles.rewardCard}>
      <div className={styles.cardAuraGlow}></div>
      
      <div className={styles.leftCol}>
        <div className={styles.rewardTag}>
          <Sparkles size={13} color="var(--accent-gold)" />
          <span>LEVEL 0{user.currentLevel} REWARDS VAULT</span>
        </div>
        <h3 className={styles.rewardTitle}>+500 VEs & 25 Gems</h3>
        <p className={styles.rewardSubtext}>
          Unlocks exclusive high-tier multipliers, XP mini-game bonus mode, and daily spin tokens.
        </p>

        <div className={styles.actionButtonsRow}>
          <button 
            className={styles.viewRewardsBtn}
            onClick={() => {
              soundFx.playClick();
              onOpenLevelModal();
            }}
          >
            <span>View Perks</span>
            <ChevronRight size={14} />
          </button>

          <button 
            className={styles.vaultWheelBtn}
            onClick={() => {
              soundFx.playStreak();
              if (onOpenLuckyWheel) onOpenLuckyWheel();
            }}
          >
            <Gift size={14} />
            <span>Lucky Vault</span>
          </button>
        </div>
      </div>

      <div className={styles.rightCol}>
        <div 
          className={styles.chestWrapper}
          onClick={() => {
            soundFx.playStreak();
            if (onOpenLuckyWheel) onOpenLuckyWheel();
            else onOpenLevelModal();
          }}
          title="Click to open lucky vault!"
        >
          <div className={styles.chestGlow}></div>
          <div className={styles.chestGraphic}>
            <div className={styles.chestLid}></div>
            <div className={styles.chestBody}>
              <div className={styles.chestLock}></div>
            </div>
            <div className={`${styles.crystal} ${styles.crystal1}`}>💎</div>
            <div className={`${styles.crystal} ${styles.crystal2}`}>✨</div>
            <div className={`${styles.crystal} ${styles.crystal3}`}>🪙</div>
          </div>
        </div>
      </div>
    </div>
  );
}
