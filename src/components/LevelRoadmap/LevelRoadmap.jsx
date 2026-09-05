import React, { useState } from 'react';
import styles from './LevelRoadmap.module.css';
import { CheckCircle2, Lock, Sparkles, Award, Trophy, Zap, Shield, Crown, Flame } from 'lucide-react';
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

  return (
    <div className={`${styles.roadmapContainer} glass-panel`}>
      <div className={styles.headerRow}>
        <div>
          <div className={styles.roadmapTag}>
            <Trophy size={14} className={styles.trophyIcon} />
            <span>PROGRESSION ROADMAP</span>
          </div>
          <h3 className={styles.roadmapHeading}>Level Milestones & Rewards</h3>
        </div>
        <span className={styles.levelStatusSummary}>
          Current: <strong>Level 0{currentLevel}</strong>
        </span>
      </div>

      {/* Interactive Horizontal Scroll / Grid Nodes */}
      <div className={styles.roadmapScroll}>
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
                {isCompleted && <CheckCircle2 size={12} className={styles.completedIcon} />}
                {isCurrent && <span className={styles.currentPulse}>YOU ARE HERE</span>}
                {isLocked && <Lock size={12} className={styles.lockIcon} />}
              </div>

              {/* Node Center Icon */}
              <div className={styles.nodeCircle}>
                <span className={styles.nodeLvlNum}>0{tier.level}</span>
                <IconComp size={16} className={styles.tierIcon} />
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
                    Requires <strong>{tier.requiredXP.toLocaleString()} XP</strong>. Unlocks {tier.rewardText} and exclusive platform benefits.
                  </p>
                </div>

                <div className={styles.detailRight}>
                  <div className={styles.perkList}>
                    <div className={styles.perkItem}>
                      <Award size={14} color="#f59e0b" />
                      <span>Reward: <strong>{tier.rewardText}</strong></span>
                    </div>
                    {tier.gems > 0 && (
                      <div className={styles.perkItem}>
                        <Sparkles size={14} color="#38bdf8" />
                        <span>Gems: <strong>+{tier.gems} Gems</strong></span>
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
