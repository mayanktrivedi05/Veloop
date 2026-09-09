import React, { useState, useRef } from 'react';
import styles from './LevelRoadmap.module.css';
import { 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Award, 
  Trophy, 
  Zap, 
  Shield, 
  Crown, 
  Flame,
  ChevronLeft,
  ChevronRight,
  Gem
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const ICON_MAP = {
  Shield: Shield,
  ShieldAlert: Shield,
  Award: Award,
  Zap: Zap,
  Crown: Crown,
  Sparkles: Sparkles,
  Flame: Flame,
  Trophy: Trophy,
};

export function LevelRoadmap({ levelTiers, currentLevel, onSelectLevel }) {
  const [selectedLvl, setSelectedLvl] = useState(currentLevel);
  const scrollRef = useRef(null);

  const scrollRoadmap = (direction) => {
    soundFx.playClick();
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.roadmapContainer}>
      <div className={styles.headerRow}>
        <div>
          <div className={styles.roadmapTag}>
            <Trophy size={14} color="var(--accent-gold)" />
            <span>LEVEL PROGRESSION ROADMAP</span>
          </div>
          <h3 className={styles.roadmapHeading}>Tier Milestones & VIP Perks</h3>
        </div>

        <div className={styles.headerRightArea}>
          <span className={styles.levelStatusSummary}>
            Current: <strong>Level 0{currentLevel}</strong>
          </span>

          <div className={styles.navArrows}>
            <button className={styles.arrowBtn} onClick={() => scrollRoadmap('left')} aria-label="Scroll left">
              <ChevronLeft size={16} />
            </button>
            <button className={styles.arrowBtn} onClick={() => scrollRoadmap('right')} aria-label="Scroll right">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Horizontal Scroll Nodes */}
      <div className={styles.roadmapScrollWrapper}>
        <div ref={scrollRef} className={styles.roadmapScroll}>
          <div className={styles.trackLine}></div>
          
          {levelTiers.map((tier) => {
            const isCompleted = tier.level < currentLevel;
            const isCurrent = tier.level === currentLevel;
            const isLocked = tier.level > currentLevel;
            const isSelected = selectedLvl === tier.level;
            const IconComp = ICON_MAP[tier.icon] || Award;

            let statusClass = styles.nodeLocked;
            if (isCompleted) statusClass = styles.nodeCompleted;
            if (isCurrent) statusClass = styles.nodeCurrent;

            return (
              <div
                key={tier.level}
                className={`${styles.roadmapNode} ${statusClass} ${isSelected ? styles.nodeSelected : ''}`}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedLvl(tier.level);
                  if (onSelectLevel) onSelectLevel(tier);
                }}
              >
                {/* Top Status Badge */}
                <div className={styles.nodeStatusBadge}>
                  {isCompleted && <CheckCircle2 size={13} className={styles.completedIcon} />}
                  {isCurrent && <span className={styles.currentPulse}>ACTIVE TIER</span>}
                  {isLocked && <Lock size={12} className={styles.lockIcon} />}
                </div>

                {/* Node Center Icon */}
                <div 
                  className={styles.nodeCircle}
                  style={{ borderColor: tier.badgeColor || 'var(--accent-primary)' }}
                >
                  <span className={styles.nodeLvlNum}>0{tier.level}</span>
                  <IconComp size={18} className={styles.tierIcon} color={tier.badgeColor || '#fff'} />
                </div>

                {/* Node Details */}
                <div className={styles.nodeInfo}>
                  <span className={styles.tierName}>{tier.name}</span>
                  <span className={styles.tierXP}>{tier.requiredXP.toLocaleString()} XP</span>
                  <div className={styles.rewardPillNode}>
                    <Sparkles size={11} className={styles.sparkleSmall} />
                    <span>{tier.rewardText}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Level Highlight Card */}
      {selectedLvl && (
        <div className={styles.detailCard}>
          {(() => {
            const tier = levelTiers.find((t) => t.level === selectedLvl);
            if (!tier) return null;
            const isCompleted = tier.level < currentLevel;
            const isCurrent = tier.level === currentLevel;
            const isLocked = tier.level > currentLevel;

            return (
              <div className={styles.detailContent}>
                <div className={styles.detailLeft}>
                  <div className={styles.detailBadgeRow}>
                    <span className={styles.detailLevelNumber}>LEVEL 0{tier.level}</span>
                    <span className={styles.detailTitle}>{tier.name}</span>
                    {isCurrent && <span className={styles.activeTag}>Current Objective</span>}
                    {isCompleted && <span className={styles.completedTag}>Unlocked & Claimed</span>}
                    {isLocked && <span className={styles.lockedTag}>Locked Milestone</span>}
                  </div>
                  <p className={styles.detailDescription}>
                    Requires <strong>{tier.requiredXP.toLocaleString()} XP</strong>. Unlocks {tier.rewardText}, higher daily earning limits, and VIP multipliers.
                  </p>
                </div>

                <div className={styles.detailRight}>
                  <div className={styles.perkList}>
                    <div className={styles.perkItem}>
                      <Award size={15} color="var(--accent-gold)" />
                      <span>Reward: <strong>{tier.rewardText}</strong></span>
                    </div>
                    {tier.gems > 0 && (
                      <div className={styles.perkItem}>
                        <Gem size={15} color="#10b981" />
                        <span>Gems: <strong>+{tier.gems} Gems</strong></span>
                      </div>
                    )}
                    {tier.spins > 0 && (
                      <div className={styles.perkItem}>
                        <Sparkles size={15} color="var(--accent-primary)" />
                        <span>Lucky Spins: <strong>+{tier.spins} Free Spins</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
