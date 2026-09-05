import React from 'react';
import styles from './TodayBoost.module.css';
import { Star, CheckCircle, Flame, Sparkles } from 'lucide-react';

export function TodayBoost({ user }) {
  return (
    <div className={`${styles.boostCard} glass-panel`}>
      <div className={styles.headerRow}>
        <div className={styles.titleBadge}>
          <Sparkles size={14} className={styles.sparkleIcon} />
          <span>TODAY'S BOOST</span>
        </div>
        <span className={styles.activeLabel}>Active Booster +15%</span>
      </div>

      <div className={styles.statsGrid}>
        {/* Stat 1: XP Earned */}
        <div className={styles.statItem}>
          <div className={`${styles.iconBubble} ${styles.starBubble}`}>
            <Star size={18} />
          </div>
          <div className={styles.statText}>
            <span className={styles.statLabel}>XP Earned</span>
            <div className={styles.statValueRow}>
              <span className={styles.statValue}>{user.todayXP}</span>
              <span className={styles.statUnit}>XP</span>
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        {/* Stat 2: Tasks Done */}
        <div className={styles.statItem}>
          <div className={`${styles.iconBubble} ${styles.tasksBubble}`}>
            <CheckCircle size={18} />
          </div>
          <div className={styles.statText}>
            <span className={styles.statLabel}>Tasks Done</span>
            <div className={styles.statValueRow}>
              <span className={styles.statValue}>{user.tasksDone}</span>
              <span className={styles.statTotal}>/{user.totalTasks}</span>
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        {/* Stat 3: Streak */}
        <div className={styles.statItem}>
          <div className={`${styles.iconBubble} ${styles.streakBubble}`}>
            <Flame size={18} />
          </div>
          <div className={styles.statText}>
            <span className={styles.statLabel}>Streak</span>
            <div className={styles.statValueRow}>
              <span className={styles.statValue}>{user.streakDays}</span>
              <span className={styles.statUnit}>Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
