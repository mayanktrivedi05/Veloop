import React from 'react';
import styles from './StateViews.module.css';
import { AlertTriangle, RefreshCw, Compass, ArrowRight } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export function LoadingSkeletonView() {
  return (
    <div className={styles.skeletonContainer}>
      {/* Hero Skeleton */}
      <div className={`${styles.skeletonHero} shimmer-effect`}>
        <div className={styles.skCircle}></div>
        <div className={styles.skLines}>
          <div className={styles.skLine1}></div>
          <div className={styles.skLine2}></div>
          <div className={styles.skLine3}></div>
        </div>
      </div>

      {/* Grid Skeletons */}
      <div className={styles.skeletonGrid}>
        <div className={`${styles.skCard} shimmer-effect`}></div>
        <div className={`${styles.skCard} shimmer-effect`}></div>
        <div className={`${styles.skCard} shimmer-effect`}></div>
      </div>
    </div>
  );
}

export function ErrorStateView({ onRetry }) {
  return (
    <div className={`${styles.errorCard} glass-panel`}>
      <div className={styles.errorIconCircle}>
        <AlertTriangle size={36} className={styles.errorIcon} />
      </div>
      <h3>Unable to Load Level Progress</h3>
      <p>We couldn't load your level and rewards information right now. Please check your network and try again.</p>
      <button 
        className={styles.retryBtn} 
        onClick={() => {
          soundFx.playClick();
          onRetry();
        }}
      >
        <RefreshCw size={16} />
        <span>Try Again</span>
      </button>
    </div>
  );
}

export function EmptyActivityStateView({ onStartEarning }) {
  return (
    <div className={`${styles.emptyCard} glass-panel`}>
      <div className={styles.emptyIconCircle}>
        <Compass size={36} className={styles.compassIcon} />
      </div>
      <h3>Your XP Journey Starts Here</h3>
      <p>Complete your first daily challenge or play XP Catcher to earn rewards and start climbing the leaderboard!</p>
      <button 
        className={styles.startEarnBtn} 
        onClick={() => {
          soundFx.playClick();
          onStartEarning();
        }}
      >
        <span>Start Earning XP</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
