import React, { useState, useRef, useEffect } from 'react';
import RoadmapBadge from './RoadmapBadge.jsx';
import styles from './LevelRoadmap.module.css';
import { 
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
  HelpCircle,
  TrendingUp,
  Gift,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { getBadgeSrc } from '../../assets/badges/index.js';
import { soundFx } from '../../utils/soundEffects';

export function LevelRoadmap({ levelTiers = [], currentLevel = 5, user, onSelectLevel }) {
  const [selectedLvl, setSelectedLvl] = useState(currentLevel);
  const [showTooltip, setShowTooltip] = useState(false);
  const scrollerRef = useRef(null);

  // Reliable smooth centering of level cards
  const scrollToLevel = (lvl, smooth = true) => {
    if (scrollerRef.current) {
      const item = scrollerRef.current.querySelector(`[data-level="${lvl}"]`);
      if (item) {
        const scroller = scrollerRef.current;
        const scrollerRect = scroller.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const targetScrollLeft = scroller.scrollLeft + (itemRect.left - scrollerRect.left) - (scrollerRect.width / 2) + (itemRect.width / 2);
        scroller.scrollTo({ 
          left: Math.max(0, targetScrollLeft), 
          behavior: smooth ? 'smooth' : 'auto' 
        });
      }
    }
  };

  // Sync selected level if currentLevel changes & auto-center
  useEffect(() => {
    setSelectedLvl(currentLevel);
    const timer = setTimeout(() => {
      scrollToLevel(currentLevel, false);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentLevel]);

  const scroll = (direction) => {
    soundFx.playClick();
    if (scrollerRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleSelectLevel = (lvl) => {
    soundFx.playClick();
    setSelectedLvl(lvl);
    scrollToLevel(lvl, true);
    const tier = levelTiers.find((t) => t.level === lvl);
    if (onSelectLevel && tier) onSelectLevel(tier);
  };

  const selectedTier = levelTiers.find((t) => t.level === selectedLvl) || levelTiers[0];
  const isSelectedCompleted = selectedTier ? selectedTier.level < currentLevel : false;
  const isSelectedCurrent = selectedTier ? selectedTier.level === currentLevel : false;
  const isSelectedLocked = selectedTier ? selectedTier.level > currentLevel : false;

  // Calculate user XP progress for the selected/current tier
  const currentXP = user?.currentXP || 6420;
  const requiredXP = selectedTier?.requiredXP || 8000;
  const remainingXP = Math.max(0, requiredXP - currentXP);
  const progressPercent = isSelectedCompleted 
    ? 100 
    : isSelectedCurrent 
      ? Math.min(100, Math.round((currentXP / requiredXP) * 100))
      : 0;

  // Perks list for selected tier
  const tierPerks = selectedTier?.perks || [
    `Daily XP limit: Up to ${Math.round(selectedTier?.requiredXP * 0.2 || 1000)} XP/day`,
    `Unlock Tier ${selectedTier?.level} exclusive rewards and multiplier boosters`,
    `Priority access to special events and weekly bonus drops`
  ];

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
                      Progress through 10 VIP tiers to unlock exclusive multipliers, daily perks, and bonus VE coins & gems.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <span className={styles.subHeading}>Explore tier milestones and VIP privileges</span>
          </div>
        </div>

        <div className={styles.navControls}>
          <div className={styles.levelStatusChip}>
            <span className={styles.pulseDot} />
            <span>Active: <strong>LVL {String(currentLevel).padStart(2, '0')}</strong></span>
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

      {/* Badges Scroller Container (Clean, no intersecting lines inside badge face) */}
      <div className={styles.scrollerContainer}>
        {/* Soft edge fade shadows */}
        <div className={styles.edgeGradientLeft} />
        <div className={styles.edgeGradientRight} />

        <div ref={scrollerRef} className={styles.scroller}>
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
                onClick={() => handleSelectLevel(tier.level)}
              />
            );
          })}
        </div>

        {/* Milestone Progress Rail Below Badges */}
        <div className={styles.bottomRailWrapper}>
          <div className={styles.railTrack}>
            <div 
              className={styles.railFill}
              style={{
                width: `${Math.min(100, Math.max(5, ((currentLevel) / (levelTiers.length || 10)) * 100))}%`
              }}
            />
          </div>
          <div className={styles.railMeta}>
            <span>Level 01</span>
            <span className={styles.railCenterText}>
              Level <strong>{String(currentLevel).padStart(2, '0')}</strong> of 10 Completed
            </span>
            <span>Level 10</span>
          </div>
        </div>
      </div>

      {/* Selected Tier Deep-Dive Card (Platinum Master & Tiers) */}
      {selectedTier && (
        <div className={`${styles.tierDetailCard} ${isSelectedCurrent ? styles.tierDetailCardCurrent : ''}`}>
          {/* Card Top: Rank Identity & Badges */}
          <div className={styles.tierDetailHeader}>
            <div className={styles.tierTitleArea}>
              <div className={styles.tierBadgeThumbnail}>
                <img 
                  src={getBadgeSrc(selectedTier.level)} 
                  alt={selectedTier.name} 
                  className={styles.tierThumbImg} 
                />
              </div>

              <div className={styles.tierNameCol}>
                <div className={styles.tierPillRow}>
                  <span className={styles.tierLevelBadge}>LEVEL {String(selectedTier.level).padStart(2, '0')}</span>
                  <span className={styles.tierTierCountText}>Tier {selectedTier.level} of 10</span>
                </div>
                <h3 className={styles.tierName}>{selectedTier.name}</h3>
              </div>
            </div>

            <div className={styles.tierStatusTag}>
              {isSelectedCompleted && (
                <span className={styles.tagCompleted}>
                  <CheckCircle2 size={13} /> Unlocked & Claimed
                </span>
              )}
              {isSelectedCurrent && (
                <span className={styles.tagCurrent}>
                  <Sparkles size={13} /> Current Active Tier
                </span>
              )}
              {isSelectedLocked && (
                <span className={styles.tagLocked}>
                  <Lock size={13} /> Locked Tier
                </span>
              )}
            </div>
          </div>

          {/* Active Level Progress Section */}
          {isSelectedCurrent && (
            <div className={styles.tierProgressBarContainer}>
              <div className={styles.progressBarMeta}>
                <div className={styles.progressLabelGroup}>
                  <Zap size={14} className={styles.progressZapIcon} />
                  <span className={styles.progressLabel}>Tier XP Progress</span>
                </div>
                <span className={styles.progressValue}>
                  {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP 
                  <strong className={styles.percentBadge}> {progressPercent}%</strong>
                </span>
              </div>
              <div className={styles.progressTrack}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className={styles.progressTipGlow} />
                </div>
              </div>
              <div className={styles.progressSubMeta}>
                <span>Level 0{selectedTier.level} Active</span>
                <span className={styles.remainingXPText}>
                  <strong>{remainingXP.toLocaleString()} XP</strong> needed for Level 0{selectedTier.level + 1}
                </span>
              </div>
            </div>
          )}

          {/* Reward Highlights Grid */}
          <div className={styles.rewardCardsGrid}>
            <div className={styles.rewardCard}>
              <div className={styles.rewardCardIconGold}>
                <Coins size={18} />
              </div>
              <div className={styles.rewardCardInfo}>
                <span className={styles.rewardCardLabel}>VEs REWARD</span>
                <span className={styles.rewardCardValGold}>
                  +{selectedTier.rewardAmount || 500} VEs
                </span>
              </div>
            </div>

            <div className={styles.rewardCard}>
              <div className={styles.rewardCardIconCyan}>
                <Gem size={18} />
              </div>
              <div className={styles.rewardCardInfo}>
                <span className={styles.rewardCardLabel}>GEM BONUS</span>
                <span className={styles.rewardCardValCyan}>
                  +{selectedTier.gems || 25} Gems
                </span>
              </div>
            </div>

            <div className={styles.rewardCard}>
              <div className={styles.rewardCardIconPurple}>
                <Sparkles size={18} />
              </div>
              <div className={styles.rewardCardInfo}>
                <span className={styles.rewardCardLabel}>LUCKY SPINS</span>
                <span className={styles.rewardCardValPurple}>
                  {selectedTier.spins || 2} Free Spins
                </span>
              </div>
            </div>
          </div>

          {/* VIP Privileges & Bonuses */}
          <div className={styles.perksList}>
            <div className={styles.perksHeaderRow}>
              <Sparkles size={14} className={styles.sparkleHeadingIcon} />
              <span className={styles.perksHeader}>Tier Privileges & Multipliers:</span>
            </div>
            
            <div className={styles.perksGrid}>
              {tierPerks.map((perk, idx) => (
                <div key={idx} className={styles.perkItem}>
                  <div className={styles.perkBulletBox}>
                    <CheckCircle2 size={13} className={styles.perkBullet} />
                  </div>
                  <span className={styles.perkText}>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tier Step Switcher */}
          <div className={styles.tierNavFooter}>
            <button 
              className={styles.tierStepBtn}
              onClick={() => handleSelectLevel(Math.max(1, selectedTier.level - 1))}
              disabled={selectedTier.level <= 1}
              type="button"
            >
              <ArrowLeft size={14} />
              <span>Level {Math.max(1, selectedTier.level - 1)}</span>
            </button>

            <span className={styles.tierStepIndicator}>
              Viewing <strong>Level {String(selectedTier.level).padStart(2, '0')}</strong>
            </span>

            <button 
              className={styles.tierStepBtn}
              onClick={() => handleSelectLevel(Math.min(10, selectedTier.level + 1))}
              disabled={selectedTier.level >= 10}
              type="button"
            >
              <span>Level {Math.min(10, selectedTier.level + 1)}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default LevelRoadmap;


