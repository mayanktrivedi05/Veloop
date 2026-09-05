import React from 'react';
import styles from './TodayBoost.module.css';
import { Star, CheckSquare, Flame, Zap } from 'lucide-react';

export function TodayBoost({ user }) {
  return (
    <div className={styles.boostSection}>
      <div className={styles.headerRow}>
        <div className={styles.titleBadge}>
          <Zap size={14} className={styles.zapIcon} />
          <span>TODAY'S BOOST</span>
        </div>
      </div>

      <div className={styles.statsRow}>
        {/* Card 1: XP Earned */}
        <div className={styles.statCard}>
          <div className={`${styles.iconCircle} ${styles.xpCircle}`}>
            <Star size={16} />
          </div>
          <span className={styles.statLabel}>XP Earned</span>
          <span className={styles.statValue}>{user.todayXP} XP</span>
        </div>

        {/* Card 2: Tasks Done */}
        <div className={styles.statCard}>
          <div className={`${styles.iconCircle} ${styles.tasksCircle}`}>
            <CheckSquare size={16} />
          </div>
          <span className={styles.statLabel}>Tasks Done</span>
          <span className={styles.statValue}>{user.tasksDone} / {user.totalTasks}</span>
        </div>

        {/* Card 3: Streak */}
        <div className={styles.statCard}>
          <div className={`${styles.iconCircle} ${styles.streakCircle}`}>
            <Flame size={16} />
          </div>
          <span className={styles.statLabel}>Streak</span>
          <span className={styles.statValue}>{user.streakDays} Days</span>
        </div>
      </div>
    </div>
  );
}

