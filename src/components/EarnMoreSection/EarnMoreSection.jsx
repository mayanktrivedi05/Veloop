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
            <span>EARN MORE</span>
          </div>
          <p className={styles.subtext}>
            Explore fun activities and earn exciting rewards.
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
          <ArrowRight size={18} />
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

              <span className={styles.cardTitle}>{item.title}</span>

              {isCompleted && (
                <span className={styles.completedBadge}>Done</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
