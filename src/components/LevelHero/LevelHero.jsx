import React, { useState } from 'react';
import styles from './LevelHero.module.css';
import { Info, Sparkles, Zap, ChevronRight, Award, Trophy, Flame } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function LevelHero({ user, onOpenGame, onEnergyTap }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [bursts, setBursts] = useState([]);
  const percentage = Math.min(100, Math.round((user.currentXP / user.requiredXP) * 100));
  const nextLvlNumber = user.currentLevel + 1;

  const handleShieldClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const burstId = Date.now() + Math.random();
    setBursts((prev) => [...prev, { id: burstId, x, y }]);
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 700);

    if (onEnergyTap) {
      onEnergyTap();
    } else {
      soundFx.playXP();
    }
  };

  return (
    <div className={styles.heroCard}>
      {/* Ambient background glows */}
      <div className={styles.heroGlow}></div>
      <div className={styles.heroSecondaryGlow}></div>
      
      <div className={styles.contentGrid}>
        {/* Top Info Row */}
        <div className={styles.topInfoRow}>
          {/* Interactive 3D Shield Badge */}
          <div className={styles.levelBadgeSection}>
            <div 
              className={styles.shieldContainer}
              onClick={handleShieldClick}
              title="Click to boost energy!"
            >
              <div className={styles.shieldOuterGlow}></div>
              <div className={styles.shieldShape}>
                <span className={styles.badgeTopTag}>LEVEL</span>
                <span className={styles.levelBigNumber}>0{user.currentLevel}</span>
                <span className={styles.shieldTapHint}>TAP +5 XP</span>
              </div>

              {/* Floating burst particles */}
              {bursts.map((b) => (
                <div 
                  key={b.id} 
                  className={styles.particleBurst}
                  style={{ left: b.x, top: b.y }}
                >
                  ⚡ +5 XP
                </div>
              ))}
            </div>

            <div className={styles.tierRankBadge}>
              <div className={styles.tierTitleRow}>
                <Trophy size={14} color="var(--accent-gold)" />
                <span className={styles.tierName}>Platinum Master</span>
              </div>
              <span className={styles.tierPercentile}>🔥 Top 5% VeLooper</span>
            </div>
          </div>

          {/* Right: XP Status & Tooltip */}
          <div className={styles.xpTextGroup}>
            <div className={styles.titleWithInfo}>
              <div className={styles.xpAmountRow}>
                <h2 className={styles.currentXPText}>
                  {user.currentXP.toLocaleString()} XP
                </h2>
                <span className={styles.xpPercentPill}>{percentage}%</span>
              </div>
              <span className={styles.toNextLevel}>
                {(user.requiredXP - user.currentXP).toLocaleString()} XP to reach Level 0{nextLvlNumber}
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
                    Earn XP by completing daily tasks, playing the XP Catcher mini-game, maintaining streaks, and spinning the Fortune Wheel!
                  </p>
                  <div className={styles.tooltipRewardHint}>
                    <Sparkles size={13} color="var(--accent-gold)" />
                    <span>L0{nextLvlNumber} Unlocks: +500 VEs, +25 Gems & 2X Multiplier</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-Width Glowing Progress Bar */}
        <div className={styles.progressBarContainer}>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill}
              style={{ width: `${percentage}%` }}
            >
              <div className={styles.fillHeadGlow}></div>
              <div className={styles.fillShineLaser}></div>
            </div>
          </div>

          <div className={styles.barFooter}>
            <div className={styles.ratioCount}>
              <strong>{user.currentXP.toLocaleString()}</strong> / {user.requiredXP.toLocaleString()} XP
            </div>
            <div className={styles.quickBoosterAction}>
              <button 
                className={styles.quickPlayBtn}
                onClick={() => {
                  soundFx.playClick();
                  onOpenGame();
                }}
              >
                <Zap size={13} />
                <span>Play Mini-Game (+50 XP)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
