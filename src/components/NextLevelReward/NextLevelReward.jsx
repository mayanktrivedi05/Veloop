import React from 'react';
import styles from './NextLevelReward.module.css';
import { ChevronRight } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function NextLevelReward({ user, onOpenLevelModal }) {
  return (
    <div className={styles.rewardCard}>
      <div className={styles.leftCol}>
        <h3 className={styles.rewardTitle}>Level 0{user.currentLevel} Rewards</h3>
        <p className={styles.rewardSubtext}>Amazing rewards await you!</p>
        <button 
          className={styles.viewRewardsBtn}
          onClick={() => {
            soundFx.playClick();
            onOpenLevelModal();
          }}
        >
          <span>View Rewards</span>
          <ChevronRight size={14} />
        </button>
      </div>

      <div className={styles.rightCol}>
        <div className={styles.chestWrapper}>
          <div className={styles.chestGlow}></div>
          <div className={styles.chestGraphic}>
            <div className={styles.chestLid}></div>
            <div className={styles.chestBody}>
              <div className={styles.chestLock}></div>
            </div>
            <div className={`${styles.crystal} ${styles.crystal1}`}>💎</div>
            <div className={`${styles.crystal} ${styles.crystal2}`}>✨</div>
            <div className={`${styles.crystal} ${styles.crystal3}`}>🔮</div>
          </div>
        </div>
      </div>
    </div>
  );
}

