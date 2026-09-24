import React from 'react';
import { getBadgeSrc, lockBadgeSrc } from '../../assets/badges/index.js';
import styles from './RoadmapBadge.module.css';
import { Check, Lock, Sparkles } from 'lucide-react';

export function RoadmapBadge({ tier, level, status, isSelected, onClick }) {
  const locked = status === 'locked';
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';

  const tierName = tier?.name ? tier.name.split(' ')[0] : `Level ${level}`;
  const xpFormatted = tier?.requiredXP >= 1000 
    ? `${(tier.requiredXP / 1000).toFixed(tier.requiredXP % 1000 === 0 ? 0 : 1)}k XP` 
    : `${tier?.requiredXP || 0} XP`;

  return (
    <div 
      className={`
        ${styles.nodeCard} 
        ${isCurrent ? styles.nodeCurrent : ''} 
        ${isCompleted ? styles.nodeCompleted : ''} 
        ${locked ? styles.nodeLocked : ''} 
        ${isSelected ? styles.nodeSelected : ''}
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Level ${level} ${tier?.name || ''} - ${status}`}
      data-level={level}
      data-current={isCurrent}
    >
      {/* Current Level Floating Pill */}
      {isCurrent && (
        <div className={styles.currentPillWrapper}>
          <span className={styles.currentPill}>
            <Sparkles size={10} className={styles.sparkleIcon} />
            YOU
          </span>
        </div>
      )}

      {/* Top Level Chip */}
      <div className={styles.levelTag}>
        <span>LVL {String(level).padStart(2, '0')}</span>
      </div>

      {/* Center Badge Pedestal */}
      <div className={styles.badgePedestal}>
        <div className={styles.badgeGlow} />
        <img
          className={styles.badgeImg}
          data-locked={locked}
          data-level={level}
          data-current={isCurrent}
          src={getBadgeSrc(level)}
          alt={`Level ${level} Badge`}
          loading="lazy"
        />

        {/* Status Indicator Overlays */}
        {isCompleted && (
          <div className={styles.completedBadge} title="Completed">
            <Check size={11} strokeWidth={3} />
          </div>
        )}

        {locked && (
          <div className={styles.lockBadge} title="Locked">
            <Lock size={12} strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Bottom Information */}
      <div className={styles.nodeFooter}>
        <span className={styles.tierShortName}>{tierName}</span>
        <span className={styles.xpRequirement}>{xpFormatted}</span>
      </div>

      {/* Active Selected Underline / Indicator */}
      {isSelected && <div className={styles.activePointer} />}
    </div>
  );
}

export default RoadmapBadge;

