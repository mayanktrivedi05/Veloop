import React, { useState } from 'react';
import styles from './Header.module.css';
import { 
  Bell, 
  Gem, 
  Menu, 
  X, 
  Sparkles, 
  Palette, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Gift, 
  Shield, 
  DollarSign, 
  HelpCircle,
  Check
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const THEMES = [
  { id: 'aurora', name: 'Cosmic Aurora', icon: '🌌', color: '#38bdf8' },
  { id: 'gold', name: 'Royal Gold', icon: '👑', color: '#ffd700' },
  { id: 'synthwave', name: 'Cyber Neon', icon: '⚡', color: '#ec4899' },
  { id: 'emerald', name: 'Emerald Matrix', icon: '🌿', color: '#10b981' },
];

export function Header({ 
  user, 
  currentTheme, 
  onSwitchTheme, 
  isMuted, 
  onToggleSound, 
  onOpenLuckyWheel,
  onOpenLevelUp
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [readNotifs, setReadNotifs] = useState(false);

  const currentThemeObj = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  return (
    <>
      <header className={styles.headerContainer}>
        {/* Left Side: Logo & User Greeting */}
        <div className={styles.leftSection}>
          <button 
            className={styles.menuToggle} 
            onClick={() => {
              soundFx.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          
          <div className={styles.desktopGreeting}>
            <div className={styles.greetingRow}>
              <h1>Good Morning, {user.name}! 🖐</h1>
              <span className={styles.verifiedPill}>
                <Sparkles size={12} /> PRO TIER
              </span>
            </div>
            <p className={styles.subtext}>
              Level up your journey and unlock epic rewards every day.
            </p>
          </div>
        </div>

        {/* Right Side Controls & Balances */}
        <div className={styles.rightSection}>
          {/* Wallet Bar */}
          <div className={styles.walletBar}>
            <div 
              className={styles.balanceItem} 
              title="VeLoop Coins - Click to earn"
              onClick={() => {
                soundFx.playCoin();
                if (onOpenLuckyWheel) onOpenLuckyWheel();
              }}
            >
              <div className={styles.veIcon}>V</div>
              <span className={styles.balanceValue}>{user.veCoins.toLocaleString()}</span>
              <span className={styles.currencyLabel}>VEs</span>
            </div>

            <div 
              className={styles.balanceItem} 
              title="Gems - Vault Currency"
              onClick={() => {
                soundFx.playCoin();
                if (onOpenLuckyWheel) onOpenLuckyWheel();
              }}
            >
              <Gem size={15} className={styles.gemIcon} />
              <span className={styles.balanceValue}>{user.gems}</span>
            </div>
          </div>

          {/* Quick Spin Wheel Launcher */}
          <button 
            className={styles.luckyWheelPill}
            onClick={() => {
              soundFx.playStreak();
              if (onOpenLuckyWheel) onOpenLuckyWheel();
            }}
            title="Open Lucky Fortune Wheel"
          >
            <Sparkles size={14} className={styles.luckySparkleIcon} />
            <span>Lucky Spin</span>
            <span className={styles.spinBadgeCount}>{user.spins || 2}</span>
          </button>

          {/* Theme Selector Dropdown */}
          <div className={styles.controlWrapper}>
            <button 
              className={styles.themeSelectorBtn}
              onClick={() => {
                soundFx.playClick();
                setThemeDropdownOpen(!themeDropdownOpen);
                setNotificationsOpen(false);
              }}
              title="Change Theme"
            >
              <span className={styles.themeIconEmoji}>{currentThemeObj.icon}</span>
              <Palette size={15} />
            </button>

            {themeDropdownOpen && (
              <div className={styles.themeDropdown}>
                <div className={styles.dropdownHeader}>
                  <h4>Select Theme</h4>
                  <span className={styles.themeSubtext}>Live Dynamic Colors</span>
                </div>
                <div className={styles.themeList}>
                  {THEMES.map((theme) => {
                    const isSelected = currentTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        className={`${styles.themeOption} ${isSelected ? styles.themeSelected : ''}`}
                        onClick={() => {
                          onSwitchTheme(theme.id);
                          setThemeDropdownOpen(false);
                        }}
                      >
                        <span className={styles.themeEmojiBig}>{theme.icon}</span>
                        <div className={styles.themeInfo}>
                          <span className={styles.themeName}>{theme.name}</span>
                          <span className={styles.themeColorDot} style={{ background: theme.color }}></span>
                        </div>
                        {isSelected && <Check size={16} color={theme.color} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Audio Mute / Unmute Toggle */}
          <button 
            className={styles.iconBtn}
            onClick={onToggleSound}
            title={isMuted ? 'Unmute Game Sounds' : 'Mute Sounds'}
            aria-label="Toggle Audio"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} color="var(--accent-primary)" />}
          </button>

          {/* Notification Bell */}
          <div className={styles.controlWrapper}>
            <button 
              className={styles.iconBtn} 
              onClick={() => {
                soundFx.playClick();
                setNotificationsOpen(!notificationsOpen);
                setThemeDropdownOpen(false);
              }}
              aria-label="Notifications"
            >
              <Bell size={18} />
              {!readNotifs && <span className={styles.notifBadge}>2</span>}
            </button>

            {notificationsOpen && (
              <div className={styles.notifDropdown}>
                <div className={styles.notifHeader}>
                  <h4>Notifications</h4>
                  <button 
                    className={styles.markRead}
                    onClick={() => {
                      soundFx.playClick();
                      setReadNotifs(true);
                    }}
                  >
                    {readNotifs ? 'All read' : 'Mark all read'}
                  </button>
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
                      <span className={styles.notifTime}>Claim your +50 XP streak bonus</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div 
            className={styles.avatarWrapper}
            onClick={() => {
              soundFx.playClick();
              if (onOpenLevelUp) onOpenLevelUp();
            }}
            title="View Level Status"
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className={styles.userAvatar} 
            />
            <span className={styles.lvlPill}>L{user.currentLevel}</span>
          </div>
        </div>
      </header>

      {/* Mobile Greeting Banner */}
      <div className={styles.mobileGreetingBanner}>
        <div className={styles.mobileGreetingRow}>
          <h2>Good Morning, {user.name}! 🖐</h2>
          <button 
            className={styles.mobileThemeQuickBtn}
            onClick={() => {
              const themeKeys = ['aurora', 'gold', 'synthwave', 'emerald'];
              const nextIndex = (themeKeys.indexOf(currentTheme) + 1) % themeKeys.length;
              onSwitchTheme(themeKeys[nextIndex]);
            }}
          >
            {currentThemeObj.icon} Theme
          </button>
        </div>
        <p className={styles.mobileSubtext}>
          Level up your journey and unlock epic rewards every day.
        </p>
      </div>

      {/* Mobile Drawer */}
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

            {/* Mobile Theme Quick Selection */}
            <div className={styles.drawerThemeSection}>
              <span className={styles.drawerSectionLabel}>Color Theme</span>
              <div className={styles.drawerThemeGrid}>
                {THEMES.map((th) => (
                  <button
                    key={th.id}
                    className={`${styles.drawerThemeCard} ${currentTheme === th.id ? styles.drawerThemeActive : ''}`}
                    onClick={() => onSwitchTheme(th.id)}
                  >
                    <span>{th.icon}</span>
                    <small>{th.name.split(' ')[0]}</small>
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Links */}
            <div className={styles.drawerNav}>
              <div className={styles.drawerNavItem} onClick={() => { setMobileMenuOpen(false); if (onOpenLevelUp) onOpenLevelUp(); }}>
                <Trophy size={18} color="var(--accent-gold)" />
                <span>Level Roadmap & Perks</span>
              </div>
              <div className={styles.drawerNavItem} onClick={() => { setMobileMenuOpen(false); if (onOpenLuckyWheel) onOpenLuckyWheel(); }}>
                <Gift size={18} color="var(--accent-secondary)" />
                <span>Lucky Vault & Wheel</span>
              </div>
              <div className={styles.drawerNavItem}>
                <DollarSign size={18} color="var(--accent-emerald)" />
                <span>Daily Earnings Hub</span>
              </div>
              <div className={styles.drawerNavItem}>
                <Shield size={18} color="var(--accent-primary)" />
                <span>VIP Security & Badges</span>
              </div>
              <div className={styles.drawerNavItem}>
                <HelpCircle size={18} color="var(--text-muted)" />
                <span>Help & FAQ</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
