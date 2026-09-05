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
    selectedActivity,
    setSelectedActivity,
  } = useProgression();

  return (
    <div className={styles.appContainer}>
      <Header user={user} />

      {/* Main Page Body */}
      <main className={styles.mainContent}>
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="toast-banner">
            <Sparkles size={16} />
            <span>{toastMessage.message}</span>
          </div>
        )}

        {/* ---------------- DEMO / QA STATE SWITCHES ---------------- */}
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

        {/* ---------------- LIVE NORMAL MODE ---------------- */}
        {viewState === 'normal' && (
          <div className={styles.dashboardGrid}>
            {/* Top Row: Full-width Level Hero */}
            <section className={styles.heroSection}>
              <LevelHero 
                user={user} 
                onOpenGame={() => setIsGameOpen(true)}
              />
            </section>

            {/* Main Progression & Activity Grid */}
            <div className={styles.layoutColumns}>
              <div className={styles.boostArea}>
                <TodayBoost user={user} />
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
                />
              </div>

              <div className={styles.rewardArea}>
                <NextLevelReward 
                  user={user}
                  onOpenLevelModal={() => setIsLevelUpModalOpen(true)}
                />
              </div>

              <div className={styles.roadmapArea}>
                <LevelRoadmap 
                  levelTiers={levelTiers}
                  currentLevel={user.currentLevel}
                />
              </div>

              <div className={styles.activityArea}>
                <RecentActivity 
                  history={history}
                  user={user}
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

      {/* 2. Level Up Celebration Modal */}
      <LevelUpModal 
        isOpen={isLevelUpModalOpen}
        onClose={() => setIsLevelUpModalOpen(false)}
        onClaim={claimLevelRewards}
        levelData={levelUpData}
        user={user}
      />

      {/* 3. Earn & Level Up Modal */}
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
            setIsLevelUpModalOpen(true);
          }
        }}
      />
    </div>
  );
}
