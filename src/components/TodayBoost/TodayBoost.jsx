import React from 'react';
import styles from './TodayBoost.module.css';
import { Star, CheckSquare, Flame, Zap, Check, ChevronRight, Clock } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function TodayBoost({ user, isStreakClaimed, onClaimStreak, onOpenTasks }) {
  return (
    <div className={styles.boostSection}>
      {/* Header with Title, Active Tag & Timer */}
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <div className={styles.titleWithZap}>
            <Zap size={18} className={styles.zapIcon} fill="#fbbf24" />
            <h3 className={styles.sectionTitle}>TODAY'S POWER BOOST</h3>
          </div>
          <div className={styles.boostPill}>
            <Zap size={12} fill="#38bdf8" />
            <span>1.5X BOOST ACTIVE</span>
          </div>
        </div>

        <div className={styles.timerPill}>
          <Clock size={13} />
          <span>06h 23m</span>
        </div>
      </div>

      {/* 3 Stacked Horizontal Cards */}
      <div className={styles.stackedCardsList}>
        {/* Card 1: XP Earned */}
        <div 
          className={styles.boostRowCard}
          onClick={() => {
            soundFx.playClick();
            if (onOpenTasks) onOpenTasks();
          }}
        >
          <div className={`${styles.squircleIcon} ${styles.blueSquircle}`}>
            <Star size={20} fill="#38bdf8" color="#38bdf8" />
          </div>

          <div className={styles.cardTextCol}>
            <span className={styles.rowLabel}>XP Earned Today</span>
            <span className={styles.rowValue}>+{user.todayXP || 215} XP</span>
          </div>

          <ChevronRight size={18} className={styles.chevronIcon} />
        </div>

        {/* Card 2: Missions Completed */}
        <div 
          className={styles.boostRowCard}
          onClick={() => {
            soundFx.playClick();
            if (onOpenTasks) onOpenTasks();
          }}
        >
          <div className={`${styles.squircleIcon} ${styles.goldSquircle}`}>
            <CheckSquare size={20} color="#fbbf24" />
          </div>

          <div className={styles.cardTextCol}>
            <span className={styles.rowLabel}>Missions Completed</span>
            <span className={styles.rowValue}>{user.tasksDone || 4} / {user.totalTasks || 8}</span>
          </div>

          <ChevronRight size={18} className={styles.chevronIcon} />
        </div>

        {/* Card 3: Active Streak */}
        <div className={styles.boostRowCard}>
          <div className={`${styles.squircleIcon} ${styles.redSquircle}`}>
            <Flame size={20} fill="#f97316" color="#f97316" />
          </div>

          <div className={styles.cardTextCol}>
            <span className={styles.rowLabel}>Active Streak</span>
            <span className={styles.rowValue}>{user.streakDays || 7} Days</span>
          </div>

          <button 
            className={`${styles.claimStreakBtn} ${isStreakClaimed ? styles.claimedBtn : ''}`}
            onClick={onClaimStreak}
            disabled={isStreakClaimed}
          >
            {isStreakClaimed ? (
              <>
                <Check size={14} />
                <span>Claimed</span>
              </>
            ) : (
              <>
                <Zap size={14} fill="#fff" />
                <span>Claim +50 XP</span>
                <ChevronRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

