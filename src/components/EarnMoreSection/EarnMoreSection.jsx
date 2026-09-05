import React from 'react';
import styles from './EarnMoreSection.module.css';
import { 
  PlayCircle, 
  CheckSquare, 
  Users, 
  Gamepad2, 
  Dice5, 
  Flame, 
  ArrowRight, 
  Sparkles,
  Check
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const ICON_MAP = {
  PlayCircle: PlayCircle,
  CheckSquare: CheckSquare,
  Users: Users,
  Gamepad2: Gamepad2,
  Dice5: Dice5,
  Flame: Flame,
};

export function EarnMoreSection({ activities, onSelectActivity, onOpenAllActivities, onOpenGame }) {
  return (
    <div className={`${styles.sectionContainer} glass-panel`}>
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
          const IconComp = ICON_MAP[item.icon] || Sparkles;
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

              <div className={styles.activityInfo}>
                <span className={styles.cardTitle}>{item.title}</span>
                <span className={styles.rewardTag}>+{item.rewardXP} XP</span>
              </div>

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
