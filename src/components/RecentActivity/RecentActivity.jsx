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
  Sparkles 
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const ICON_MAP = {
  UserPlus: UserPlus,
  CheckCircle2: CheckSquare,
  PlayCircle: Gamepad2,
  Coins: Coins,
  Flame: Flame,
  Sparkles: Sparkles,
};

export function RecentActivity({ history, user }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filteredHistory = history.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'task') return item.category === 'task' || item.category === 'watch';
    if (activeFilter === 'game') return item.category === 'game';
    if (activeFilter === 'referral') return item.category === 'referral';
    return true;
  });

  return (
    <div className={styles.activityContainer}>
      {/* Header */}
      <div className={styles.headerRow}>
        <h3 className={styles.titleText}>RECENT ACTIVITY</h3>

        <div className={styles.filterWrapper}>
          <button 
            className={styles.filterBtn} 
            onClick={() => {
              soundFx.playClick();
              setShowFilterMenu(!showFilterMenu);
            }}
            aria-label="Filter activities"
          >
            <Filter size={16} />
          </button>

          {showFilterMenu && (
            <div className={styles.filterDropdown}>
              {['all', 'task', 'game', 'referral'].map((f) => (
                <button
                  key={f}
                  className={`${styles.filterOption} ${activeFilter === f ? styles.optionActive : ''}`}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveFilter(f);
                    setShowFilterMenu(false);
                  }}
                >
                  {f === 'all' ? 'All Activities' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity List */}
      <div className={styles.activityList}>
        {filteredHistory.length === 0 ? (
          <div className={styles.emptyState}>
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
                    borderColor: `${item.color}40`,
                    color: item.color 
                  }}
                >
                  <IconComp size={16} />
                </div>

                <div className={styles.activityMeta}>
                  <span className={styles.activityAmount}>{item.amount}</span>
                  <span className={styles.activityTitle}>{item.subtitle}</span>
                  <span className={styles.activityTime}>{item.time}</span>
                </div>

                <ChevronRight size={16} className={styles.arrowIcon} />
              </div>
            );
          })
        )}
      </div>

      {/* Today's Summary Footer (Screen 6) */}
      <div className={styles.summaryFooter}>
        <span className={styles.summaryTitle}>Today's Summary</span>
        <div className={styles.summaryStats}>
          <div className={styles.summaryItem}>
            <div className={styles.xpCircle}>XP</div>
            <div className={styles.summaryTextCol}>
              <span className={styles.summaryValue}>{user.todayXP} XP</span>
              <span className={styles.summarySub}>Total Earned</span>
            </div>
          </div>

          <div className={styles.summaryItem}>
            <div className={styles.veCircle}>V</div>
            <div className={styles.summaryTextCol}>
              <span className={styles.summaryValue}>{user.todayVEs} VEs</span>
              <span className={styles.summarySub}>Total Earned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

