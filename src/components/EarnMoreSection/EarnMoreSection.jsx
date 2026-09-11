import React from 'react';
import styles from './EarnMoreSection.module.css';
import { 
  Gamepad2, 
  Calendar, 
  Users, 
  Rocket, 
  Zap, 
  ChevronRight, 
  ClipboardList,
  Check
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const QUEST_ITEMS = [
  {
    id: 'watch-earn',
    title: 'Watch & Earn',
    rewardXP: 50,
    icon: Gamepad2,
    squircleClass: styles.purpleSquircle,
    btnClass: styles.blueBtn,
    iconColor: '#c084fc'
  },
  {
    id: 'daily-tasks',
    title: 'Daily Tasks',
    rewardXP: 30,
    icon: Calendar,
    squircleClass: styles.goldSquircle,
    btnClass: styles.goldBtn,
    iconColor: '#fbbf24'
  },
  {
    id: 'refer-earn',
    title: 'Refer & Earn',
    rewardXP: 100,
    icon: Users,
    squircleClass: styles.orangeSquircle,
    btnClass: styles.orangeBtn,
    iconColor: '#f97316'
  },
  {
    id: 'xp-catcher',
    title: 'XP Catcher',
    rewardXP: 10,
    icon: Rocket,
    squircleClass: styles.cyanSquircle,
    btnClass: styles.cyanBtn,
    iconColor: '#38bdf8',
    isGame: true
  },
  {
    id: 'mini-games',
    title: 'Mini Games',
    rewardXP: 75,
    icon: Gamepad2,
    squircleClass: styles.magentaSquircle,
    btnClass: styles.magentaBtn,
    iconColor: '#ec4899',
    isGame: true
  }
];

export function EarnMoreSection({ 
  activities, 
  onSelectActivity, 
  onOpenAllActivities, 
  onOpenGame 
}) {
  return (
    <div className={styles.questHubSection}>
      {/* Header with Lightning Icon & All Quests Pill */}
      <div className={styles.sectionHeader}>
        <div className={styles.headerLeftCol}>
          <div className={styles.titleRow}>
            <div className={styles.cyanLightningCircle}>
              <Zap size={16} fill="#38bdf8" color="#38bdf8" />
            </div>
            <h3 className={styles.headerTitle}>
              EARN & <span className={styles.cyanHighlight}>QUEST HUB</span>
            </h3>
          </div>
          <p className={styles.subtext}>
            Complete activities, play arcade games, and level up faster.
          </p>
        </div>

        <button 
          className={styles.allQuestsBtn}
          onClick={() => {
            soundFx.playClick();
            onOpenAllActivities();
          }}
        >
          <ClipboardList size={14} />
          <span>All Quests</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Stacked Mission List */}
      <div className={styles.questList}>
        {QUEST_ITEMS.map((quest) => {
          const activityData = activities.find(a => a.id === quest.id);
          const isCompleted = activityData?.completed;
          const IconComp = quest.icon;

          return (
            <div 
              key={quest.id}
              className={`${styles.questRowCard} ${isCompleted ? styles.questCompleted : ''}`}
              onClick={() => {
                soundFx.playClick();
                if (quest.isGame) {
                  onOpenGame();
                } else if (activityData) {
                  onSelectActivity(activityData);
                } else {
                  onSelectActivity(quest);
                }
              }}
            >
              {/* Left Squircle */}
              <div className={`${styles.squircleIcon} ${quest.squircleClass}`}>
                {isCompleted ? <Check size={20} color="#10b981" /> : <IconComp size={20} color={quest.iconColor} />}
              </div>

              {/* Title & XP Badge */}
              <div className={styles.questDetailsCol}>
                <span className={styles.questTitle}>{quest.title}</span>
                <div className={styles.xpRewardPill}>
                  <span className={styles.xpBadgeLabel}>XP</span>
                  <span className={styles.xpAmountText}>+{quest.rewardXP} XP</span>
                </div>
              </div>

              {/* Start Button */}
              <button className={`${styles.startBtn} ${quest.btnClass}`}>
                <span>{isCompleted ? 'Done' : 'Start'}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

