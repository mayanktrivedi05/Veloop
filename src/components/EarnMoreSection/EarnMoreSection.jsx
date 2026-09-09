import React from 'react';
import styles from './EarnMoreSection.module.css';
import { 
  Play, 
  ListChecks, 
  Users, 
  Magnet, 
  Gamepad2, 
  Flame, 
  ArrowRight, 
  Sparkles,
  Check,
  Zap,
  Gift
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const ICON_MAP = {
  'watch-earn': Play,
  'daily-tasks': ListChecks,
  'refer-earn': Users,
  'xp-catcher': Magnet,
  'mini-games': Gamepad2,
  'streak-bonus': Flame,
};

export function EarnMoreSection({ 
  activities, 
  onSelectActivity, 
  onOpenAllActivities, 
  onOpenGame,
  onOpenLuckyWheel
}) {
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <div>
          <div className={styles.titleBadge}>
            <Zap size={14} color="var(--accent-primary)" />
            <span>EARN & QUEST HUB</span>
          </div>
          <p className={styles.subtext}>
            Complete activities, play arcade games, and level up faster.
          </p>
        </div>
        <button 
          className={styles.viewAllBtn} 
          onClick={() => {
            soundFx.playClick();
            onOpenAllActivities();
          }}
          aria-label="View all activities"
        >
          <span>All Quests</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div className={styles.activitiesGrid}>
        {activities.map((item) => {
          const IconComp = ICON_MAP[item.id] || Sparkles;
          const isCompleted = item.completed;

          return (
            <div
              key={item.id}
              className={`${styles.activityCard} ${isCompleted ? styles.cardCompleted : ''}`}
              onClick={() => {
                soundFx.playClick();
                if (item.isGame) {
                  onOpenGame();
                } else {
                  onSelectActivity(item);
                }
              }}
            >
              <div 
                className={styles.iconCircle}
                style={{ 
                  background: `${item.accentColor}20`, 
                  borderColor: `${item.accentColor}50`,
                  color: item.accentColor 
                }}
              >
                {isCompleted ? <Check size={18} className={styles.checkIcon} /> : <IconComp size={18} />}
              </div>

              <div className={styles.cardDetails}>
                <span className={styles.cardTitle}>{item.title}</span>
                <span className={styles.cardRewardPill}>+{item.rewardXP} XP</span>
              </div>

              {isCompleted ? (
                <span className={styles.completedBadge}>Done</span>
              ) : (
                <span className={styles.readyBadge}>Start</span>
              )}
            </div>
          );
        })}

        {/* Lucky Fortune Wheel Special Action Card */}
        <div 
          className={`${styles.activityCard} ${styles.luckyWheelCard}`}
          onClick={() => {
            soundFx.playStreak();
            if (onOpenLuckyWheel) onOpenLuckyWheel();
          }}
        >
          <div className={styles.iconCircleSpecial}>
            <Gift size={18} color="#ffd700" />
          </div>
          <div className={styles.cardDetails}>
            <span className={styles.cardTitle}>Lucky Spin</span>
            <span className={styles.cardRewardPillGold}>Free Spin</span>
          </div>
          <span className={styles.spinActiveBadge}>Spin</span>
        </div>
      </div>
    </div>
  );
}
