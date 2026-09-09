import React from 'react';
import styles from './LevelDashboard.module.css';
import { useProgression } from '../hooks/useProgression';
import { Header } from '../components/Header/Header';
import { LevelHero } from '../components/LevelHero/LevelHero';
import { TodayBoost } from '../components/TodayBoost/TodayBoost';
import { EarnMoreSection } from '../components/EarnMoreSection/EarnMoreSection';
import { NextLevelReward } from '../components/NextLevelReward/NextLevelReward';
import { LevelRoadmap } from '../components/LevelRoadmap/LevelRoadmap';
import { RecentActivity } from '../components/RecentActivity/RecentActivity';
import { XPGame } from '../components/PlayAndEarn/XPGame';
import { LevelUpModal } from '../components/LevelUpModal/LevelUpModal';
import { ActivityModal } from '../components/ActivityModal/ActivityModal';
import { LuckyWheelModal } from '../components/LuckyWheelModal/LuckyWheelModal';
import { BottomNav } from '../components/BottomNav/BottomNav';
import { 
  LoadingSkeletonView, 
  ErrorStateView, 
  EmptyActivityStateView 
} from '../components/StateViews/StateViews';
import { Sparkles } from 'lucide-react';

export function LevelDashboard() {
  const {
    user,
    currentTheme,
    switchTheme,
    isMuted,
    toggleSound,
    levelTiers,
    activities,
    history,
    isGameOpen,
    setIsGameOpen,
    gameHighScore,
    handleGameFinish,
    isLevelUpModalOpen,
    setIsLevelUpModalOpen,
    levelUpData,
    claimLevelRewards,
    activeTab,
    setActiveTab,
    completeActivity,
    viewState,
    setViewState,
    toastMessage,
    isActivityModalOpen,
    setIsActivityModalOpen,
    isLuckyWheelOpen,
    setIsLuckyWheelOpen,
    selectedActivity,
    setSelectedActivity,
    isStreakClaimed,
    claimStreakBonus,
    handleHeroEnergyTap,
    handleRewardWon,
  } = useProgression();

  return (
    <div className={styles.appContainer}>
      <Header 
        user={user} 
        currentTheme={currentTheme}
        onSwitchTheme={switchTheme}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        onOpenLuckyWheel={() => setIsLuckyWheelOpen(true)}
        onOpenLevelUp={() => setIsLevelUpModalOpen(true)}
      />

      {/* Main Page Body */}
      <main className={styles.mainContent}>
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="toast-banner">
            <Sparkles size={16} />
            <span>{toastMessage.message}</span>
          </div>
        )}

        {/* DEMO / QA STATE SWITCHES */}
        {viewState === 'loading' && <LoadingSkeletonView />}

        {viewState === 'error' && (
          <ErrorStateView onRetry={() => setViewState('normal')} />
        )}

        {viewState === 'empty' && (
          <EmptyActivityStateView 
            onStartEarning={() => {
              setViewState('normal');
              setIsActivityModalOpen(true);
            }} 
          />
        )}

        {/* LIVE NORMAL MODE */}
        {viewState === 'normal' && (
          <div className={styles.dashboardGrid}>
            {/* Top Row: Full-width Interactive Level Hero */}
            <section className={styles.heroSection}>
              <LevelHero 
                user={user} 
                onOpenGame={() => setIsGameOpen(true)}
                onEnergyTap={handleHeroEnergyTap}
              />
            </section>

            {/* Main Progression & Activity Grid */}
            <div className={styles.layoutColumns}>
              <div className={styles.boostArea}>
                <TodayBoost 
                  user={user} 
                  isStreakClaimed={isStreakClaimed}
                  onClaimStreak={claimStreakBonus}
                  onOpenTasks={() => setIsActivityModalOpen(true)}
                />
              </div>

              <div className={styles.rewardArea}>
                <NextLevelReward 
                  user={user}
                  onOpenLevelModal={() => setIsLevelUpModalOpen(true)}
                  onOpenLuckyWheel={() => setIsLuckyWheelOpen(true)}
                />
              </div>

              <div className={styles.earnArea}>
                <EarnMoreSection 
                  activities={activities}
                  onSelectActivity={(act) => {
                    setSelectedActivity(act);
                    setIsActivityModalOpen(true);
                  }}
                  onOpenAllActivities={() => {
                    setSelectedActivity(null);
                    setIsActivityModalOpen(true);
                  }}
                  onOpenGame={() => setIsGameOpen(true)}
                  onOpenLuckyWheel={() => setIsLuckyWheelOpen(true)}
                />
              </div>

              <div className={styles.activityArea}>
                <RecentActivity 
                  history={history}
                  user={user}
                />
              </div>

              <div className={styles.roadmapArea}>
                <LevelRoadmap 
                  levelTiers={levelTiers}
                  currentLevel={user.currentLevel}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ---------------- MODALS & OVERLAYS ---------------- */}
      {/* 1. XP Catcher Mini-Game */}
      <XPGame 
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
        onFinishGame={handleGameFinish}
        user={user}
        highScore={gameHighScore}
      />

      {/* 2. Lucky Fortune Wheel & Mystery Vault Modal */}
      <LuckyWheelModal 
        isOpen={isLuckyWheelOpen}
        onClose={() => setIsLuckyWheelOpen(false)}
        onRewardWon={handleRewardWon}
        spinsLeft={user.spins || 2}
      />

      {/* 3. Level Up Celebration Modal */}
      <LevelUpModal 
        isOpen={isLevelUpModalOpen}
        onClose={() => setIsLevelUpModalOpen(false)}
        onClaim={claimLevelRewards}
        levelData={levelUpData}
        user={user}
      />

      {/* 4. Earn & Level Up Modal */}
      <ActivityModal 
        isOpen={isActivityModalOpen}
        onClose={() => {
          setIsActivityModalOpen(false);
          setSelectedActivity(null);
        }}
        activities={activities}
        onCompleteActivity={completeActivity}
        onOpenGame={() => setIsGameOpen(true)}
        selectedActivity={selectedActivity}
        setSelectedActivity={setSelectedActivity}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'earn') {
            setIsActivityModalOpen(true);
          } else if (tab === 'rewards') {
            setIsLuckyWheelOpen(true);
          } else if (tab === 'roadmap') {
            const roadmapEl = document.querySelector(`.${styles.roadmapArea}`);
            if (roadmapEl) {
              roadmapEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }}
      />
    </div>
  );
}
