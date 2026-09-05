import React, { useState } from 'react';
import styles from './NextLevelReward.module.css';
import { Lock, Unlock, Sparkles, ChevronRight, Gem, Info } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function NextLevelReward({ user, onOpenLevelModal }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const percentage = Math.min(100, Math.round((user.currentXP / user.requiredXP) * 100));
  const isUnlocked = user.currentXP >= user.requiredXP;

  return (
    <div className={`${styles.rewardCard} glass-panel`}>
      <div className={styles.topRow}>
        <div>
          <div className={styles.rewardTag}>
            <Sparkles size={13} className={styles.sparkleIcon} />
            <span>LEVEL 0{user.currentLevel} REWARDS</span>
          </div>
          <p className={styles.rewardSubtext}>
            Amazing rewards await you upon completion!
          </p>
        </div>

        <div className={styles.infoWrapper}>
          <button 
            className={styles.infoBtn}
            onClick={() => setShowTooltip(!showTooltip)}
            aria-label="Reward information"
          >
            <Info size={15} />
          </button>
          {showTooltip && (
            <div className={styles.infoTooltip}>
              <p>The displayed reward is associated with Level 0{user.currentLevel} according to the VELOOP reward system.</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.chestDisplay}>
        <div className={styles.chestGlow}></div>
        
        {/* Animated 3D-styled Treasure Chest Graphic */}
        <div className={styles.chestGraphicBox}>
          <div className={styles.chestContainer}>
            <div className={styles.chestLid}></div>
            <div className={styles.chestBody}>
              <div className={styles.chestLock}>
                {isUnlocked ? <Unlock size={14} color="#10b981" /> : <Lock size={14} color="#f59e0b" />}
              </div>
            </div>
            {/* Sparkling Orbiters */}
            <div className={`${styles.orbiter} ${styles.orb1}`}>💎</div>
            <div className={`${styles.orbiter} ${styles.orb2}`}>🪙</div>
          </div>
        </div>

        {/* Reward breakdown */}
        <div className={styles.rewardsBreakdown}>
          <div className={styles.rewardPill}>
            <div className={styles.coinBadge}>V</div>
            <span className={styles.rewardAmount}>+500 VEs</span>
          </div>
          <div className={styles.rewardPill}>
            <Gem size={15} className={styles.gemBadge} />
            <span className={styles.rewardAmount}>+25 Gems</span>
          </div>
        </div>
      </div>

      {/* Progress to Unlock */}
      <div className={styles.unlockMeter}>
        <div className={styles.meterHeader}>
          <span className={styles.unlockStatus}>
            {isUnlocked ? '🎉 Ready to claim!' : `Reach Level 0${user.currentLevel + 1} to unlock`}
          </span>
          <span className={styles.meterPercent}>{percentage}%</span>
        </div>
        <div className={styles.meterTrack}>
          <div className={styles.meterFill} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>

      <button 
        className={styles.viewRewardsBtn}
        onClick={() => {
          soundFx.playClick();
          onOpenLevelModal();
        }}
      >
        <span>{isUnlocked ? 'Claim Level Reward' : 'View Level Perks'}</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
