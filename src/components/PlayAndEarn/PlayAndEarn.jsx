import React, { useState, useEffect } from 'react';
import goldCoin from '../../assets/coins/gold.svg';
import veIcon from '../../assets/coins/ve.svg';
import cartTop from '../../assets/cart/cart-top.svg';
import styles from './PlayAndEarn.module.css';
import { soundFx } from '../../utils/soundEffects';

const COIN_POSITIONS = [
  { left: '4%', top: '-10px', duration: 5.2, delay: -0.4 },
  { left: '78%', top: '-8px', duration: 6.1, delay: -2.1 },
  { left: '90%', top: '35px', duration: 4.8, delay: -3.4 },
  { left: '2%', top: '48px', duration: 5.6, delay: -1.2 },
  { left: '85%', top: '85px', duration: 6.4, delay: -4.6 },
  { left: '8%', top: '105px', duration: 5.0, delay: -0.9 },
  { left: '88%', top: '135px', duration: 5.8, delay: -3.9 },
];

export function PlayAndEarn({ onOpenGame, attemptsLeft = 3 }) {
  const [countdown, setCountdown] = useState('11:42:18');
  const canPlay = attemptsLeft > 0;

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight - now;
      const hours = Math.floor(diffMs / 3600000);
      const mins = Math.floor((diffMs % 3600000) / 60000);
      const secs = Math.floor((diffMs % 60000) / 1000);
      setCountdown(
        `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.dashboardCard}>
      {/* Background Cart Art */}
      <img className={styles.cartTopArt} src={cartTop} alt="" aria-hidden="true" />

      {/* Floating Animated Gold Coins */}
      {COIN_POSITIONS.map(({ left, top, duration, delay }, i) => (
        <img
          key={i}
          className={styles.floatingCoin}
          style={{ 
            left, 
            top, 
            animationDuration: `${duration}s`, 
            animationDelay: `${delay}s` 
          }}
          src={goldCoin}
          alt=""
          aria-hidden="true"
        />
      ))}

      <div className={styles.cardContent}>
        <h2 className={styles.cardHeading}>VE Coin Catch</h2>
        <p className={styles.cardSubtext}>Play to earn VEs & XP</p>

        <button
          className={styles.playNowBtn}
          type="button"
          disabled={!canPlay}
          onClick={() => {
            soundFx.playClick();
            if (onOpenGame) onOpenGame();
          }}
        >
          <img className={styles.btnIcon} src={veIcon} alt="" aria-hidden="true" />
          <span className={styles.btnLabel}>Play Now</span>
        </button>

        {canPlay ? (
          <div className={styles.attemptsChip}>
            <span>⚡ {attemptsLeft} attempts remaining today</span>
          </div>
        ) : (
          <div className={styles.attemptsChip}>
            <svg className={styles.attemptsIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Next attempt in {countdown}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayAndEarn;
