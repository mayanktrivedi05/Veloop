import React, { useState } from 'react';
import styles from './LevelHero.module.css';
import { Info, Sparkles, Zap, ChevronRight, Award } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function LevelHero({ user, onOpenGame }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const percentage = Math.min(100, Math.round((user.currentXP / user.requiredXP) * 100));
  const nextLvlNumber = user.currentLevel + 1;

  return (
    <div className={styles.heroCard}>
      <div className={styles.heroGlow}></div>
      
      <div className={styles.contentGrid}>
        {/* Left: Prominent Level Shield */}
        <div className={styles.levelBadgeSection}>
          <div className={styles.shieldContainer}>
            <div className={styles.shieldOuterGlow}></div>
            <div className={styles.shieldShape}>
              <span className={styles.badgeTopTag}>LEVEL</span>
              <span className={styles.levelBigNumber}>0{user.currentLevel}</span>
            </div>
          </div>
        </div>

        {/* Center: Progression and XP Bar */}
        <div className={styles.progressionDetails}>
          <div className={styles.headerInfo}>
            <div className={styles.titleWithInfo}>
              <h2 className={styles.currentXPText}>
                {user.currentXP.toLocaleString()} XP
              </h2>
              <span className={styles.toNextLevel}>
                to reach Level 0{nextLvlNumber}
              </span>
            </div>

            <div className={styles.infoWrapper}>
              <button 
                className={styles.infoBtn}
                onClick={() => {
                  soundFx.playClick();
                  setShowTooltip(!showTooltip);
                }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                aria-label="Level information"
              >
                <Info size={16} />
              </button>
              {showTooltip && (
                <div className={styles.infoTooltip}>
                  <div className={styles.tooltipArrow}></div>
                  <strong>How Level Progression Works</strong>
                  <p>
                    Earn XP by completing daily tasks, playing the XP Catcher mini-game, and referring friends. Reaching Level 0{nextLvlNumber} unlocks +500 VEs, +25 Gems, and high-tier multipliers!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Highly Visual XP Progress Bar */}
          <div className={styles.progressBarContainer}>
            <div className={styles.progressTrack}>
              <div 
                className={styles.progressFill}
                style={{ width: `${percentage}%` }}
              >
                <div className={styles.fillHeadGlow}></div>
              </div>
            </div>

            <div className={styles.barFooter}>
              <span className={styles.ratioCount}>
                <strong>{user.currentXP.toLocaleString()}</strong> / {user.requiredXP.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action CTA (Desktop/Tablet) */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaBox}>
            <div className={styles.ctaSparkle}>
              <Sparkles size={16} />
            </div>
            <div className={styles.ctaContent}>
              <span className={styles.ctaTag}>ACCELERATE PROGRESS</span>
              <h4>Play XP Catcher</h4>
              <p>Catch coins & score up to +50 XP in 20s!</p>
            </div>
            <button 
              className={styles.playNowBtn} 
              onClick={() => {
                soundFx.playClick();
                onOpenGame();
              }}
            >
              <span>Play Now</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

