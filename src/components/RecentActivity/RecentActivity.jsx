import React, { useState } from 'react';
import styles from './RecentActivity.module.css';
import { 
  Filter, 
  ChevronRight, 
  Coins, 
  Sparkles, 
  UserPlus, 
  CheckCircle2, 
  PlayCircle, 
  Flame, 
  History 
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const ICON_MAP = {
  UserPlus: UserPlus,
  CheckCircle2: CheckCircle2,
  PlayCircle: PlayCircle,
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
    <div className={`${styles.activityContainer} glass-panel`}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleRow}>
          <History size={16} className={styles.titleIcon} />
          <h3>RECENT ACTIVITY</h3>
        </div>

        <div className={styles.filterWrapper}>
          <button 
            className={styles.filterBtn} 
            onClick={() => {
              soundFx.playClick();
              setShowFilterMenu(!showFilterMenu);
            }}
            aria-label="Filter activities"
          >
            <Filter size={15} />
            <span className={styles.filterLabel}>{activeFilter.toUpperCase()}</span>
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
          filteredHistory.slice(0, 6).map((item) => {
            const IconComp = ICON_MAP[item.icon] || Sparkles;
            const isVE = item.type === 've' || item.amount.includes('VEs');

            return (
              <div key={item.id} className={styles.activityRow}>
                <div 
                  className={styles.iconCircle}
                  style={{ 
                    background: `${item.color}15`, 
                    borderColor: `${item.color}35`,
                    color: item.color 
                  }}
                >
                  <IconComp size={16} />
                </div>

                <div className={styles.activityMeta}>
                  <div className={styles.titleAndAmount}>
                    <span className={styles.activityTitle}>{item.subtitle}</span>
                    <span 
                      className={styles.activityAmount}
                      style={{ color: isVE ? '#fbbf24' : '#38bdf8' }}
                    >
                      {item.amount}
                    </span>
                  </div>
                  <span className={styles.activityTime}>{item.time}</span>
                </div>

                <ChevronRight size={14} className={styles.arrowIcon} />
              </div>
            );
          })
        )}
      </div>

      {/* Today's Summary Footer */}
      <div className={styles.summaryFooter}>
        <div className={styles.summaryTitle}>Today's Summary</div>
        <div className={styles.summaryStats}>
          <div className={styles.summaryItem}>
            <div className={styles.xpCircle}>XP</div>
            <div>
              <div className={styles.summaryValue}>{user.todayXP} XP</div>
              <div className={styles.summarySub}>Total Earned</div>
            </div>
          </div>

          <div className={styles.summaryDivider}></div>

          <div className={styles.summaryItem}>
            <div className={styles.veCircle}>V</div>
            <div>
              <div className={styles.summaryValue}>{user.todayVEs} VEs</div>
              <div className={styles.summarySub}>Total Earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
