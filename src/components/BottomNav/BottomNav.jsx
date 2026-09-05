import React from 'react';
import styles from './BottomNav.module.css';
import { Home, DollarSign, Gift, Wallet, User } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'earn', label: 'Earn', icon: DollarSign },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className={styles.bottomNavContainer}>
      <div className={styles.navBar}>
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={`${styles.navItem} ${isActive ? styles.itemActive : ''}`}
              onClick={() => {
                soundFx.playClick();
                onTabChange(tab.id);
              }}
              aria-label={tab.label}
            >
              <div className={styles.iconWrapper}>
                <IconComp size={20} />
                {isActive && <div className={styles.activeGlow}></div>}
              </div>
              <span className={styles.navLabel}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
