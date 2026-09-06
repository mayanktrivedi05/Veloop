import React from 'react';
import styles from './MobileFrame.module.css';
import { Smartphone, Monitor, Sparkles, Wifi, Battery, Signal } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function MobileFrame({ 
  children, 
  activeScreen, 
  onSelectScreen,
  isPhoneFrame,
  setIsPhoneFrame 
}) {
  const screens = [
    { id: 'screen1', label: '1. Dashboard', badge: 'Home' },
    { id: 'screen2', label: '2. XP Catcher', badge: 'Game' },
    { id: 'screen3', label: '3. Challenge Complete', badge: 'Result' },
    { id: 'screen4', label: '4. Earn & Level Up', badge: 'Tasks' },
    { id: 'screen5', label: '5. Level Up Modal', badge: 'Level 05' },
    { id: 'screen6', label: '6. Recent Activity', badge: 'History' },
  ];

  return (
    <div className={styles.showcaseWrapper}>
      {/* Top Demo Toolbar (Visible on Desktop / Tablets) */}
      <header className={styles.topToolbar}>
        <div className={styles.toolbarBrand}>
          <span className={styles.brandTitle}>VELOOP Mobile App</span>
          <span className={styles.specBadge}>
            <Sparkles size={12} /> 6 Mockup Screens
          </span>
        </div>

        {/* Screen Switcher Pills */}
        <div className={styles.screensNav}>
          {screens.map((s) => (
            <button
              key={s.id}
              className={`${styles.screenPill} ${activeScreen === s.id ? styles.pillActive : ''}`}
              onClick={() => {
                soundFx.playClick();
                onSelectScreen(s.id);
              }}
            >
              <span>{s.label}</span>
              <span className={styles.tagBadge}>{s.badge}</span>
            </button>
          ))}
        </div>

        {/* Frame Toggle */}
        <div className={styles.viewToggles}>
          <button
            className={`${styles.toggleBtn} ${isPhoneFrame ? styles.toggleActive : ''}`}
            onClick={() => {
              soundFx.playClick();
              setIsPhoneFrame(true);
            }}
            title="iPhone 15 Pro Frame View"
          >
            <Smartphone size={15} />
            <span className={styles.btnText}>Phone Frame</span>
          </button>
          <button
            className={`${styles.toggleBtn} ${!isPhoneFrame ? styles.toggleActive : ''}`}
            onClick={() => {
              soundFx.playClick();
              setIsPhoneFrame(false);
            }}
            title="Fluid Responsive Full Width"
          >
            <Monitor size={15} />
            <span className={styles.btnText}>Fluid</span>
          </button>
        </div>
      </header>

      {/* Main Container: Either iPhone Bezel or Full Width */}
      <div className={`${styles.viewportContainer} ${isPhoneFrame ? styles.phoneMode : styles.fluidMode}`}>
        {isPhoneFrame ? (
          <div className={styles.iphoneBezel}>
            {/* iPhone Top Status Bar with Dynamic Island */}
            <div className={styles.phoneHeader}>
              <span className={styles.timeText}>9:41</span>
              <div className={styles.dynamicIsland}>
                <div className={styles.islandCamera}></div>
                <div className={styles.islandSensor}></div>
              </div>
              <div className={styles.statusIcons}>
                <Signal size={12} />
                <Wifi size={12} />
                <Battery size={13} />
              </div>
            </div>

            {/* Scrollable Screen Body */}
            <div className={styles.phoneScreenBody}>
              {children}
            </div>

            {/* iPhone Home Indicator Bar */}
            <div className={styles.homeIndicatorBar}>
              <div className={styles.homeIndicator}></div>
            </div>
          </div>
        ) : (
          <div className={styles.fluidScreenBody}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
