import React, { useState } from 'react';
import styles from './Header.module.css';
import { 
  Bell, 
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
import logoSvg from '../../assets/logo.svg';
import veSvg from '../../assets/coins/ve.svg';
import gemSvg from '../../assets/coins/gem.svg';
import { getBadgeSrc } from '../../assets/badges/index.js';

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
        {/* Left Side: Brand Logo & Hamburger */}
        <div className={styles.leftBrandSection}>
          <button 
            className={styles.menuToggle} 
            onClick={() => {
              soundFx.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className={styles.brandLogoWrapper}>
            <img className={styles.brandLogo} src={logoSvg} alt="VeLoop" />
          </div>
        </div>

        {/* Currency Stat Pills */}
        <div className={styles.walletBar}>
          <div 
            className={styles.balanceItemVE} 
            title="VeLoop Coins"
            onClick={() => {
              soundFx.playCoin();
              if (onOpenLuckyWheel) onOpenLuckyWheel();
            }}
          >
            <img className={styles.tokenIcon} src={veSvg} alt="VE" />
            <span className={styles.balanceValue}>{user.veCoins?.toLocaleString() || 485} VEs</span>
          </div>

          <div 
            className={styles.balanceItemGem} 
            title="Gems"
            onClick={() => {
              soundFx.playCoin();
              if (onOpenLuckyWheel) onOpenLuckyWheel();
            }}
          >
            <img className={styles.tokenIcon} src={gemSvg} alt="GEM" />
            <span className={styles.balanceValue}>{user.gems?.toLocaleString() || 45}</span>
          </div>

          <div 
            className={styles.levelChip}
            title="Current Tier"
            onClick={() => {
              soundFx.playClick();
              if (onOpenLevelUp) onOpenLevelUp();
            }}
          >
            <img 
              className={styles.levelBadgeIcon} 
              src={getBadgeSrc(user.currentLevel || 5)} 
              alt={`Level ${user.currentLevel || 5}`} 
            />
            <span className={styles.levelChipText}>LVL {user.currentLevel || 5}</span>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className={styles.rightSection}>
          {/* Audio Sound Toggle */}
          <button 
            className={styles.iconCircleBtn}
            onClick={onToggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Toggle Audio"
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          {/* Notification Bell */}
          <div className={styles.controlWrapper}>
            <button 
              className={styles.iconCircleBtn} 
              onClick={() => {
                soundFx.playClick();
                setNotificationsOpen(!notificationsOpen);
                setThemeDropdownOpen(false);
              }}
              aria-label="Notifications"
            >
              <Bell size={17} />
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

          {/* Crown Level Avatar */}
          <div 
            className={styles.crownAvatarWrapper}
            onClick={() => {
              soundFx.playClick();
              if (onOpenLevelUp) onOpenLevelUp();
            }}
            title="View Level Status"
          >
            <span className={styles.crownIconTop}>👑</span>
            <span className={styles.lvlBadgeText}>L{user.currentLevel || 5}</span>
          </div>
        </div>
      </header>

      {/* Greeting & Theme Row */}
      <div className={styles.greetingHeader}>
        <div className={styles.greetingTextCol}>
          <h1 className={styles.greetingTitle}>
            Good Morning, <br className={styles.mobileBreak} />
            <span className={styles.goldUsername}>VeLooper! 👑</span>
          </h1>
          <p className={styles.subtext}>
            Level up your journey and unlock epic rewards every day.
          </p>
        </div>

        <button 
          className={styles.themePillBtn}
          onClick={() => {
            soundFx.playClick();
            const themeKeys = ['aurora', 'gold', 'synthwave', 'emerald'];
            const nextIndex = (themeKeys.indexOf(currentTheme) + 1) % themeKeys.length;
            onSwitchTheme(themeKeys[nextIndex]);
          }}
          title="Toggle Color Theme"
        >
          <span>👑</span>
          <span>Theme</span>
        </button>
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
