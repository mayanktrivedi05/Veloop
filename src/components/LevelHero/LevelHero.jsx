import React, { useState } from 'react';
import styles from './LevelHero.module.css';
import { Sparkles, Zap, ChevronRight, Trophy, ChevronUp } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';
import { getBadgeSrc } from '../../assets/badges/index.js';

export function LevelHero({ user, onOpenGame, onEnergyTap, onOpenLevelUp }) {
  const [bursts, setBursts] = useState([]);
  const percentage = Math.min(100, Math.round((user.currentXP / user.requiredXP) * 100));
  const remainingXP = Math.max(0, user.requiredXP - user.currentXP);
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
      {/* Golden Mountain & Light Beams Background */}
      <div className={styles.goldenBeams}></div>
      <div className={styles.mountainGraphic}></div>

      <div className={styles.cardContent}>
        {/* Top Section: Shield & Rank Details */}
        <div className={styles.headerRow}>
          {/* Official Badge Crest */}
          <div 
            className={styles.shieldWrapper}
            onClick={handleShieldClick}
            title="Tap to boost XP!"
          >
            <img 
              className={styles.heroBadgeImg} 
              src={getBadgeSrc(user.currentLevel || 5)} 
              alt={`Level ${user.currentLevel || 5}`} 
            />

            {/* Click Burst Particles */}
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

          {/* Rank Title & Tier Pill */}
          <div className={styles.rankDetailsCol}>
            <div className={styles.rankTitleRow}>
              <span className={styles.trophyIcon}>🏆</span>
              <h2 className={styles.rankTitle}>Platinum Master</h2>
            </div>
            <div className={styles.tierPercentileBadge}>
              <span className={styles.flameIcon}>🔥</span>
              <span>Top 5% VeLooper</span>
            </div>
          </div>
        </div>

        {/* XP Status & Percentage Row */}
        <div className={styles.xpStatusSection}>
          <div className={styles.xpAmountRow}>
            <h3 className={styles.xpNumberText}>
              {user.currentXP.toLocaleString()} XP
            </h3>
            <span className={styles.xpPercentPill}>{percentage}%</span>
          </div>

          <div className={styles.xpSubtextRow}>
            <span className={styles.toNextLevelText}>
              {remainingXP.toLocaleString()} XP to reach Level 0{nextLvlNumber}
            </span>
            <button 
              className={styles.expandCircleBtn}
              onClick={() => {
                soundFx.playClick();
                if (onOpenLevelUp) onOpenLevelUp();
              }}
              title="View Level Roadmap"
            >
              <ChevronUp size={16} />
            </button>
          </div>
        </div>

        {/* Progress Bar with Glowing Bulb Tip */}
        <div className={styles.progressBarWrapper}>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill}
              style={{ width: `${percentage}%` }}
            >
              <div className={styles.progressGlowingBulb}></div>
            </div>
          </div>
        </div>

        {/* Full-Width Play Mini-Game CTA Button */}
        <button 
          className={styles.playMiniGameBtn}
          onClick={() => {
            soundFx.playClick();
            onOpenGame();
          }}
        >
          <Zap size={16} fill="#fff" />
          <span>Play Mini-Game (+50 XP)</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

