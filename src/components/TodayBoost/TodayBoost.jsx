import React from 'react';
import styles from './TodayBoost.module.css';
import { Star, CheckSquare, Flame, Zap, Check, ChevronRight } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function TodayBoost({ user, isStreakClaimed, onClaimStreak, onOpenTasks }) {
  return (
    <div className={styles.boostSection}>
      <div className={styles.headerRow}>
        <div className={styles.titleBadge}>
          <Zap size={15} className={styles.zapIcon} />
          <span>TODAY'S POWER BOOST</span>
        </div>
        <span className={styles.dailyMultiplierTag}>⚡ 1.5X BOOST ACTIVE</span>
      </div>

      <div className={styles.statsRow}>
        {/* Card 1: XP Earned */}
        <div className={styles.statCard}>
          <div className={`${styles.iconCircle} ${styles.xpCircle}`}>
            <Star size={18} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>XP Earned Today</span>
            <span className={styles.statValue}>+{user.todayXP} XP</span>
          </div>
        </div>

        {/* Card 2: Tasks Done */}
        <div 
          className={`${styles.statCard} ${styles.clickableCard}`}
          onClick={() => {
            soundFx.playClick();
            if (onOpenTasks) onOpenTasks();
          }}
          title="Click to view daily missions"
        >
          <div className={`${styles.iconCircle} ${styles.tasksCircle}`}>
            <CheckSquare size={18} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Missions Completed</span>
            <span className={styles.statValue}>{user.tasksDone} / {user.totalTasks}</span>
          </div>
          <ChevronRight size={16} className={styles.statArrow} />
        </div>

        {/* Card 3: Streak */}
        <div className={`${styles.statCard} ${styles.streakCard}`}>
          <div className={`${styles.iconCircle} ${styles.streakCircle}`}>
            <Flame size={18} className={styles.flameIcon} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Active Streak</span>
            <span className={styles.statValue}>{user.streakDays} Days</span>
          </div>

          <button 
            className={`${styles.claimStreakBtn} ${isStreakClaimed ? styles.claimedBtn : ''}`}
            onClick={onClaimStreak}
            disabled={isStreakClaimed}
          >
            {isStreakClaimed ? (
              <>
                <Check size={13} />
                <span>Claimed</span>
              </>
            ) : (
              <>
                <Zap size={13} />
                <span>Claim +50 XP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
