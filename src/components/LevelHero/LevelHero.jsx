import React, { useState } from 'react';
import styles from './LevelHero.module.css';
import { Info, Sparkles, Zap, ChevronRight, Award } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function LevelHero({ user, onOpenGame }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const percentage = Math.min(100, Math.round((user.currentXP / user.requiredXP) * 100));
  const xpNeeded = Math.max(0, user.requiredXP - user.currentXP);
  const nextLvlNumber = user.currentLevel + 1;

  return (
    <div className={`${styles.heroCard} glass-panel`}>
      <div className={styles.heroGlow}></div>
      
      <div className={styles.contentGrid}>
        {/* Left: Prominent Level Shield */}
        <div className={styles.levelBadgeSection}>
          <div className={styles.shieldContainer}>
            <div className={styles.shieldOuterGlow}></div>
            <div className={styles.shieldShape}>
              <div className={styles.badgeTopTag}>CURRENT LEVEL</div>
              <span className={styles.levelBigNumber}>0{user.currentLevel}</span>
              <div className={styles.badgeBottomRow}>
                <Award size={13} className={styles.badgeIcon} />
                <span>MASTER</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Progression and XP Bar */}
        <div className={styles.progressionDetails}>
          <div className={styles.headerInfo}>
            <div className={styles.titleWithInfo}>
              <h2 className={styles.currentXPText}>
                {user.currentXP.toLocaleString()} <span className={styles.xpUnit}>XP</span>
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
            <div className={styles.barLabels}>
              <span className={styles.rangeStart}>
                Level 0{user.currentLevel}
              </span>
              <span className={styles.ratioCount}>
                <strong>{user.currentXP.toLocaleString()}</strong> / {user.requiredXP.toLocaleString()} XP
              </span>
              <span className={styles.rangeEnd}>
                Level 0{nextLvlNumber}
              </span>
            </div>

            <div className={styles.progressTrack}>
              <div 
                className={styles.progressFill}
                style={{ width: `${percentage}%` }}
              >
                <div className={styles.fillHeadGlow}></div>
              </div>
            </div>

            <div className={styles.barFooter}>
              <div className={styles.percentagePill}>
                <Zap size={13} className={styles.zapIcon} />
                <span>{percentage}% Completed</span>
              </div>
              <span className={styles.remainingText}>
                <strong className={styles.neededXP}>{xpNeeded.toLocaleString()} XP</strong> remaining
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action CTA to Play Mini-Game */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaBox}>
            <div className={styles.ctaSparkle}>
              <Sparkles size={16} />
            </div>
            <div className={styles.ctaContent}>
              <span className={styles.ctaTag}>ACCELERATE PROGRESS</span>
              <h4>Play XP Catcher</h4>
              <p>Catch coins & score up to +50 XP in 20 seconds!</p>
            </div>
            <button 
              className={styles.playNowBtn} 
              onClick={() => {
                soundFx.playClick();
                onOpenGame();
              }}
            >
              <span>Play Now</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
