import React, { useState } from 'react';
import styles from './Header.module.css';
import { Bell, Gem, Menu, X, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function Header({ user }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.leftSection}>
        <button 
          className={styles.menuToggle} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className={styles.welcomeText}>
          <div className={styles.greetingRow}>
            <h1>Good Morning, {user.name}!</h1>
            <span className={styles.verifiedPill}>
              <Sparkles size={12} /> PRO
            </span>
          </div>
          <p className={styles.subtext}>
            Level up your journey and unlock epic rewards every day.
          </p>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.walletBar}>
          <div className={styles.balanceItem} title="VeLoop Coins">
            <div className={styles.veIcon}>V</div>
            <span className={styles.balanceValue}>{user.veCoins.toLocaleString()}</span>
            <span className={styles.currencyLabel}>VEs</span>
          </div>

          <div className={styles.balanceItem} title="Gems">
            <Gem size={15} className={styles.gemIcon} />
            <span className={styles.balanceValue}>{user.gems}</span>
          </div>
        </div>

        {/* Notification Bell */}
        <div className={styles.notifWrapper}>
          <button 
            className={styles.iconBtn} 
            onClick={() => {
              soundFx.playClick();
              setNotificationsOpen(!notificationsOpen);
            }}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className={styles.notifBadge}>2</span>
          </button>

          {notificationsOpen && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <h4>Notifications</h4>
                <span className={styles.markRead}>2 unread</span>
              </div>
              <div className={styles.notifList}>
                <div className={styles.notifItem}>
                  <div className={styles.notifDot}></div>
                  <div>
                    <p className={styles.notifTitle}>🎮 Daily XP Catcher Ready!</p>
                    <span className={styles.notifTime}>Catch orbs to claim up to +50 XP</span>
                  </div>
                </div>
                <div className={styles.notifItem}>
                  <div className={styles.notifDot}></div>
                  <div>
                    <p className={styles.notifTitle}>🔥 7-Day Streak Achieved!</p>
                    <span className={styles.notifTime}>Claim your +25 XP streak bonus</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className={styles.avatarWrapper}>
          <img 
            src={user.avatar} 
            alt={user.name} 
            className={styles.userAvatar} 
          />
          <span className={styles.lvlPill}>L{user.currentLevel}</span>
        </div>
      </div>
    </header>
  );
}
