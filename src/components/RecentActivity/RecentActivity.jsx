import React, { useState } from 'react';
import styles from './RecentActivity.module.css';
import { 
  Filter, 
  ChevronRight, 
  Coins, 
  UserPlus, 
  CheckSquare, 
  Gamepad2, 
  Flame, 
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const ICON_MAP = {
  UserPlus: UserPlus,
  CheckCircle2: CheckSquare,
  PlayCircle: Gamepad2,
  Gamepad2: Gamepad2,
  Coins: Coins,
  Flame: Flame,
  Sparkles: Sparkles,
};

export function RecentActivity({ history, user }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredHistory = history.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'task') return item.category === 'task' || item.category === 'mission';
    if (activeFilter === 'game') return item.category === 'game' || item.category === 'arcade';
    if (activeFilter === 'referral') return item.category === 'referral';
    return true;
  });

  return (
    <div className={styles.activityContainer}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.activityPulseDot}></div>
          <h3 className={styles.titleText}>LIVE ACTIVITY FEED</h3>
        </div>

        {/* Filter Pills */}
        <div className={styles.filterBar}>
          {['all', 'task', 'game', 'referral'].map((f) => (
            <button
              key={f}
              className={`${styles.filterPill} ${activeFilter === f ? styles.filterPillActive : ''}`}
              onClick={() => {
                soundFx.playClick();
                setActiveFilter(f);
              }}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className={styles.activityList}>
        {filteredHistory.length === 0 ? (
          <div className={styles.emptyState}>
            <Activity size={24} color="var(--text-muted)" />
            <p>No activity yet in this filter.</p>
          </div>
        ) : (
          filteredHistory.slice(0, 5).map((item) => {
            const IconComp = ICON_MAP[item.icon] || Sparkles;

            return (
              <div key={item.id} className={styles.activityRow}>
                <div 
                  className={styles.iconCircle}
                  style={{ 
                    background: `${item.color}20`, 
                    borderColor: `${item.color}50`,
                    color: item.color 
                  }}
                >
                  <IconComp size={16} />
                </div>

                <div className={styles.activityMeta}>
                  <div className={styles.titleRow}>
                    <span className={styles.activityTitle}>{item.subtitle}</span>
                    <span className={styles.activityTime}>{item.time}</span>
                  </div>
                  <span className={styles.activityAmount} style={{ color: item.color }}>
                    {item.amount}
                  </span>
                </div>

                <ChevronRight size={15} className={styles.arrowIcon} />
              </div>
            );
          })
        )}
      </div>

      {/* Today's Summary Footer */}
      <div className={styles.summaryFooter}>
        <span className={styles.summaryTitle}>⚡ Today's Harvest</span>
        <div className={styles.summaryStats}>
          <div className={styles.summaryItem}>
            <div className={styles.xpCircle}>XP</div>
            <div className={styles.summaryTextCol}>
              <span className={styles.summaryValue}>+{user.todayXP} XP</span>
              <span className={styles.summarySub}>Experience</span>
            </div>
          </div>

          <div className={styles.summaryItem}>
            <div className={styles.veCircle}>V</div>
            <div className={styles.summaryTextCol}>
              <span className={styles.summaryValue}>+{user.todayVEs} VEs</span>
              <span className={styles.summarySub}>Tokens</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
