import React from 'react';
import styles from './BottomNav.module.css';
import { Home, Zap, Gift, Trophy, User } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'earn', label: 'Earn', icon: Zap },
  { id: 'rewards', label: 'Vault', icon: Gift },
  { id: 'roadmap', label: 'Ranks', icon: Trophy },
];

export function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className={styles.bottomNavContainer}>
      <div className={styles.navInner}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              onClick={() => {
                soundFx.playClick();
                onTabChange(item.id);
              }}
            >
              <div className={styles.iconWrapper}>
                <Icon size={20} />
                {isActive && <div className={styles.activeGlowDot}></div>}
              </div>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
