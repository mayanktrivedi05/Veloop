import React from 'react';
import { getBadgeSrc, lockBadgeSrc } from '../../assets/badges/index.js';
import styles from './RoadmapBadge.module.css';

export function RoadmapBadge({ level, status, isSelected, onClick }) {
  const locked = status === 'locked';
  const isCurrent = status === 'current';

  return (
    <div 
      className={`${styles.item} ${isSelected ? styles.itemSelected : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Level ${level} ${status}`}
    >
      {isCurrent && (
        <div className={styles.tip}>
          <span className={styles.tipLabel}>You are here</span>
          <div className={styles.tipArrow} />
        </div>
      )}
      <div className={styles.badgeWrapper}>
        <img
          className={styles.badge}
          data-locked={locked}
          data-level={level}
          data-current={isCurrent}
          src={getBadgeSrc(level)}
          alt={`Level ${level}`}
        />
        {locked && (
          <div className={styles.lockOverlay}>
            <img className={styles.lock} src={lockBadgeSrc} alt="Locked" aria-hidden="true" />
          </div>
        )}
      </div>
      <span className={`${styles.levelLabel} ${isCurrent ? styles.levelLabelCurrent : ''}`}>
        LVL {level}
      </span>
    </div>
  );
}

export default RoadmapBadge;
