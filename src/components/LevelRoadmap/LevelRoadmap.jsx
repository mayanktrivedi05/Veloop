import React, { useState, useRef, useEffect } from 'react';
import RoadmapBadge from './RoadmapBadge.jsx';
import styles from './LevelRoadmap.module.css';
import { 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Coins, 
  Gem,
  Award,
  Crown,
  Flame,
  Shield,
  HelpCircle
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function LevelRoadmap({ levelTiers = [], currentLevel = 5, user, onSelectLevel }) {
  const [selectedLvl, setSelectedLvl] = useState(currentLevel);
  const [showTooltip, setShowTooltip] = useState(false);
  const scrollerRef = useRef(null);

  // Sync selected level if currentLevel changes
  useEffect(() => {
    setSelectedLvl(currentLevel);
  }, [currentLevel]);

  // Auto-scroll to center current level on mount
  useEffect(() => {
    if (scrollerRef.current) {
      const activeItem = scrollerRef.current.querySelector(`[data-current="true"]`);
      if (activeItem) {
        setTimeout(() => {
          activeItem.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
          });
        }, 100);
      }
    }
  }, [currentLevel]);

  const scroll = (direction) => {
    soundFx.playClick();
    if (scrollerRef.current) {
      const offset = direction === 'left' ? -240 : 240;
      scrollerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const selectedTier = levelTiers.find((t) => t.level === selectedLvl) || levelTiers[0];
  const isSelectedCompleted = selectedTier ? selectedTier.level < currentLevel : false;
  const isSelectedCurrent = selectedTier ? selectedTier.level === currentLevel : false;
  const isSelectedLocked = selectedTier ? selectedTier.level > currentLevel : false;

  // Calculate user XP progress for the selected/current tier
  const currentXP = user?.currentXP || 6420;
  const requiredXP = selectedTier?.requiredXP || 8000;
  const progressPercent = isSelectedCompleted 
    ? 100 
    : isSelectedCurrent 
      ? Math.min(100, Math.round((currentXP / requiredXP) * 100))
      : 0;

  return (
    <section className={styles.section}>
      {/* Header Row */}
      <div className={styles.headingRow}>
        <div className={styles.headingGroup}>
          <div className={styles.headerIconBox}>
            <Crown size={16} className={styles.crownIcon} />
          </div>
          <div>
            <div className={styles.titleRow}>
              <h2 className={styles.heading}>Level Progression</h2>
              <div className={styles.infoWrapper}>
                <button 
                  className={styles.infoBtn}
                  onClick={() => setShowTooltip(!showTooltip)}
                  aria-label="Progression info"
                  type="button"
                >
                  <HelpCircle size={15} />
                </button>
                {showTooltip && (
                  <div className={styles.tooltipCard}>
                    <p>
                      Ascend through 10 VIP tiers. Earn XP by completing daily quests, spinning the wheel, and catching coins to unlock exclusive perks, higher multiplier caps, and gem bonuses.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <span className={styles.subHeading}>Tap any badge to inspect tier rewards</span>
          </div>
        </div>

        <div className={styles.navControls}>
          <div className={styles.levelStatusChip}>
            <span className={styles.pulseDot} />
            <span>Tier: <strong>LVL {String(currentLevel).padStart(2, '0')}</strong></span>
          </div>
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

      {/* Badges Scroller Container */}
      <div className={styles.scrollerContainer}>
        {/* Soft edge fade shadows */}
        <div className={styles.edgeGradientLeft} />
        <div className={styles.edgeGradientRight} />

        <div ref={scrollerRef} className={styles.scroller}>
          {/* Milestone Track Line */}
          <div className={styles.milestoneLineTrack}>
            <div 
              className={styles.milestoneLineProgress}
              style={{
                width: `${Math.min(100, Math.max(0, ((currentLevel - 0.5) / (levelTiers.length || 10)) * 100))}%`
              }}
            />
          </div>

          {levelTiers.map((tier) => {
            const status = 
              tier.level < currentLevel ? 'completed' : 
              tier.level === currentLevel ? 'current' : 'locked';

            return (
              <RoadmapBadge
                key={tier.level}
                tier={tier}
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

      {/* Selected Tier Deep-Dive Card */}
      {selectedTier && (
        <div className={styles.tierDetailCard}>
          {/* Card Top: Rank Name & Status */}
          <div className={styles.tierDetailHeader}>
            <div className={styles.tierTitleArea}>
              <div className={styles.tierLevelBadge}>
                <span>LVL {selectedTier.level}</span>
              </div>
              <div className={styles.tierNameCol}>
                <h3 className={styles.tierName}>{selectedTier.name}</h3>
                <span className={styles.tierStatusText}>
                  {isSelectedCompleted && "Completed & Claimed"}
                  {isSelectedCurrent && "Your Active Level"}
                  {isSelectedLocked && `Requires ${selectedTier.requiredXP?.toLocaleString()} XP`}
                </span>
              </div>
            </div>

            <div className={styles.tierStatusTag}>
              {isSelectedCompleted && (
                <span className={styles.tagCompleted}>
                  <CheckCircle2 size={13} /> Unlocked
                </span>
              )}
              {isSelectedCurrent && (
                <span className={styles.tagCurrent}>
                  <Sparkles size={13} /> Active Tier
                </span>
              )}
              {isSelectedLocked && (
                <span className={styles.tagLocked}>
                  <Lock size={13} /> Locked Tier
                </span>
              )}
            </div>
          </div>

          {/* Active Progress Bar (for current level) */}
          {isSelectedCurrent && (
            <div className={styles.tierProgressBarContainer}>
              <div className={styles.progressBarMeta}>
                <span className={styles.progressLabel}>Tier Progress</span>
                <span className={styles.progressValue}>
                  {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP ({progressPercent}%)
                </span>
              </div>
              <div className={styles.progressTrack}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className={styles.tierStatsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>REQUIRED THRESHOLD</span>
              <span className={styles.statValueBlue}>
                <Zap size={14} className={styles.zapIcon} />
                {selectedTier.requiredXP?.toLocaleString()} XP
              </span>
            </div>
            
            <div className={styles.statBox}>
              <span className={styles.statLabel}>TIER UNLOCK REWARD</span>
              <span className={styles.statValueGold}>
                <Coins size={14} className={styles.coinIcon} />
                {selectedTier.rewardText || `+${selectedTier.rewardAmount} VEs`}
              </span>
            </div>
          </div>

          {/* Perks & Privileges */}
          {selectedTier.perks && selectedTier.perks.length > 0 && (
            <div className={styles.perksList}>
              <span className={styles.perksHeader}>
                <Sparkles size={13} className={styles.sparkleHeadingIcon} />
                Tier Privileges & Bonuses:
              </span>
              <div className={styles.perksGrid}>
                {selectedTier.perks.map((perk, idx) => (
                  <div key={idx} className={styles.perkItem}>
                    <CheckCircle2 size={14} className={styles.perkBullet} />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default LevelRoadmap;

