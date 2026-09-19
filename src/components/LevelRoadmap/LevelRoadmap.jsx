import React, { useState, useRef, useEffect } from 'react';
import RoadmapBadge from './RoadmapBadge.jsx';
import styles from './LevelRoadmap.module.css';
import { 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Coins, 
  Gem,
  Award
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function LevelRoadmap({ levelTiers = [], currentLevel = 5, onSelectLevel }) {
  const [selectedLvl, setSelectedLvl] = useState(currentLevel);
  const [showTooltip, setShowTooltip] = useState(false);
  const scrollerRef = useRef(null);

  // Auto-scroll to current level on mount
  useEffect(() => {
    if (scrollerRef.current) {
      const activeItem = scrollerRef.current.querySelector(`[data-current="true"]`);
      if (activeItem) {
        activeItem.parentElement.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [currentLevel]);

  const scroll = (direction) => {
    soundFx.playClick();
    if (scrollerRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const selectedTier = levelTiers.find((t) => t.level === selectedLvl) || levelTiers[0];
  const isSelectedCompleted = selectedTier ? selectedTier.level < currentLevel : false;
  const isSelectedCurrent = selectedTier ? selectedTier.level === currentLevel : false;
  const isSelectedLocked = selectedTier ? selectedTier.level > currentLevel : false;

  return (
    <section className={styles.section}>
      <div className={styles.headingRow}>
        <div className={styles.headingGroup}>
          <h2 className={styles.heading}>Level Progression</h2>
          <div className={styles.infoWrapper}>
            <button 
              className={styles.infoBtn}
              onClick={() => setShowTooltip(!showTooltip)}
              aria-label="Progression info"
              type="button"
            >
              <Info size={16} />
            </button>
            {showTooltip && (
              <div className={styles.tooltipCard}>
                <p>Track your journey across every level. Reach each tier's XP threshold to unlock its exclusive rewards, multiplier boosters, and daily perks.</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.navControls}>
          <span className={styles.levelStatusChip}>
            Current: <strong>Level {String(currentLevel).padStart(2, '0')}</strong>
          </span>
          <div className={styles.navButtons}>
            <button className={styles.navBtn} onClick={() => scroll('left')} aria-label="Scroll left" type="button">
              <ChevronLeft size={16} />
            </button>
            <button className={styles.navBtn} onClick={() => scroll('right')} aria-label="Scroll right" type="button">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Badges Scroller */}
      <div className={styles.scrollerWrapper}>
        <div ref={scrollerRef} className={styles.scroller}>
          {levelTiers.map((tier) => {
            const status = 
              tier.level < currentLevel ? 'completed' : 
              tier.level === currentLevel ? 'current' : 'locked';

            return (
              <RoadmapBadge
                key={tier.level}
                level={tier.level}
                status={status}
                isSelected={selectedLvl === tier.level}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedLvl(tier.level);
                  if (onSelectLevel) onSelectLevel(tier);
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Selected Tier Details Preview */}
      {selectedTier && (
        <div className={styles.tierDetailCard}>
          <div className={styles.tierDetailHeader}>
            <div className={styles.tierTitleArea}>
              <div className={styles.tierLevelBadge}>
                <span>LEVEL {selectedTier.level}</span>
              </div>
              <h3 className={styles.tierName}>{selectedTier.name}</h3>
            </div>

            <div className={styles.tierStatusTag}>
              {isSelectedCompleted && (
                <span className={styles.tagCompleted}>
                  <CheckCircle2 size={13} /> Unlocked
                </span>
              )}
              {isSelectedCurrent && (
                <span className={styles.tagCurrent}>
                  <Sparkles size={13} /> Current Level
                </span>
              )}
              {isSelectedLocked && (
                <span className={styles.tagLocked}>
                  <Lock size={13} /> Locked Tier
                </span>
              )}
            </div>
          </div>

          <div className={styles.tierStatsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>REQUIRED XP</span>
              <span className={styles.statValue}>
                <Zap size={14} className={styles.zapIcon} />
                {selectedTier.requiredXP?.toLocaleString()} XP
              </span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>TIER REWARD</span>
              <span className={styles.statValueGold}>
                <Coins size={14} className={styles.coinIcon} />
                {selectedTier.rewardText || `+${selectedTier.rewardAmount} VEs`}
              </span>
            </div>
          </div>

          {selectedTier.perks && selectedTier.perks.length > 0 && (
            <div className={styles.perksList}>
              <span className={styles.perksHeader}>Tier Privileges & Bonuses:</span>
              <ul>
                {selectedTier.perks.map((perk, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={13} className={styles.perkBullet} />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default LevelRoadmap;
