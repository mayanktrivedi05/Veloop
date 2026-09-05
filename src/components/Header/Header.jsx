import React, { useState } from 'react';
import styles from './Header.module.css';
import { Bell, Gem, Menu, X, Sparkles, User, Shield, Gift, DollarSign, HelpCircle, Trophy } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function Header({ user }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.leftSection}>
          <button 
            className={styles.menuToggle} 
            onClick={() => {
              soundFx.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className={styles.desktopGreeting}>
            <div className={styles.greetingRow}>
              <h1>Good Morning, {user.name}! 🖐</h1>
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

          {/* User Avatar (Desktop) */}
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

      {/* Mobile Greeting Banner (Shown right under header in mobile layout) */}
      <div className={styles.mobileGreetingBanner}>
        <div className={styles.mobileGreetingRow}>
          <h2>Good Morning, {user.name}! 🖐</h2>
        </div>
        <p className={styles.mobileSubtext}>
          Level up your journey and unlock epic rewards every day.
        </p>
      </div>

      {/* Mobile Drawer / Sidebar */}
      {mobileMenuOpen && (
        <div className={styles.drawerOverlay} onClick={() => setMobileMenuOpen(false)}>
          <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <div className={styles.drawerUser}>
                <img src={user.avatar} alt={user.name} className={styles.drawerAvatar} />
                <div>
                  <h4 className={styles.drawerUserName}>{user.name}</h4>
                  <span className={styles.drawerUserHandle}>{user.username} • Level 0{user.currentLevel}</span>
                </div>
              </div>
              <button 
                className={styles.drawerCloseBtn} 
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Balances */}
            <div className={styles.drawerBalances}>
              <div className={styles.drawerBalanceCard}>
                <span className={styles.drawerBalLabel}>VE Coins</span>
                <span className={styles.drawerBalVal}>{user.veCoins} VEs</span>
              </div>
              <div className={styles.drawerBalanceCard}>
                <span className={styles.drawerBalLabel}>Gems</span>
                <span className={styles.drawerBalVal}>💎 {user.gems}</span>
              </div>
            </div>

            {/* Menu Links */}
            <div className={styles.drawerNav}>
              <div className={styles.drawerNavItem}>
                <Trophy size={18} color="#f59e0b" />
                <span>Level Roadmap</span>
              </div>
              <div className={styles.drawerNavItem}>
                <DollarSign size={18} color="#10b981" />
                <span>Earn & Tasks</span>
              </div>
              <div className={styles.drawerNavItem}>
                <Gift size={18} color="#a855f7" />
                <span>Rewards Vault</span>
              </div>
              <div className={styles.drawerNavItem}>
                <Shield size={18} color="#38bdf8" />
                <span>Security & Tier Status</span>
              </div>
              <div className={styles.drawerNavItem}>
                <HelpCircle size={18} color="#94a3b8" />
                <span>Help & FAQ</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

