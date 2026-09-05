import { useState, useCallback } from 'react';
import { INITIAL_USER, LEVEL_TIERS, EARN_ACTIVITIES, INITIAL_ACTIVITY_HISTORY } from '../data/mockData';
import { soundFx } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export function useProgression() {
  const [user, setUser] = useState(INITIAL_USER);
  const [activities, setActivities] = useState(EARN_ACTIVITIES);
  const [history, setHistory] = useState(INITIAL_ACTIVITY_HISTORY);
  
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [gameState, setGameState] = useState('start');
  const [gameScore, setGameScore] = useState(0);
  const [gameHighScore, setGameHighScore] = useState(92);
  const [gameRewards, setGameRewards] = useState({ xp: 30, ves: 12 });
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [viewState, setViewState] = useState('normal');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToastMessage({ message, type, id });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.id === id ? null : prev));
    }, 3500);
  }, []);

  const triggerLevelUpCelebration = useCallback(() => {
    soundFx.playLevelUp();
    setIsLevelUpModalOpen(true);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#f59e0b', '#a855f7', '#10b981'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const addXP = useCallback((amount, sourceName = 'Reward', earnedVEs = 0) => {
    setUser((prev) => {
      const newXP = prev.currentXP + amount;
      const newTodayXP = prev.todayXP + amount;
      const newVEs = prev.veCoins + earnedVEs;
      const newTodayVEs = prev.todayVEs + earnedVEs;
      const isLevelUp = newXP >= prev.requiredXP;

      if (isLevelUp) {
        const nextLvl = prev.currentLevel + 1;
        const nextTier = LEVEL_TIERS.find((t) => t.level === nextLvl) || {
          requiredXP: prev.requiredXP + 5000,
          rewardAmount: 1000,
          gems: 50,
        };

        setLevelUpData({
          oldLevel: prev.currentLevel,
          newLevel: nextLvl,
          rewardVEs: nextTier.rewardAmount || 500,
          rewardGems: nextTier.gems || 25,
          perks: nextTier.perks || [
            'Increased daily earning potential',
            'Exclusive level badges and multipliers',
            'Higher tier challenges unlocked',
          ],
        });

        setTimeout(() => {
          triggerLevelUpCelebration();
        }, 600);

        return {
          ...prev,
          currentLevel: nextLvl,
          currentXP: newXP,
          requiredXP: nextTier.requiredXP,
          veCoins: newVEs,
          todayXP: newTodayXP,
          todayVEs: newTodayVEs,
        };
      }

      return {
        ...prev,
        currentXP: newXP,
        todayXP: newTodayXP,
        veCoins: newVEs,
        todayVEs: newTodayVEs,
      };
    });

    const newActivity = {
      id: `act-${Date.now()}`,
      title: `+${amount} XP`,
      subtitle: sourceName,
      time: 'Just now',
      type: earnedVEs > 0 ? 've' : 'xp',
      category: sourceName.toLowerCase().includes('game') ? 'game' : 'task',
      amount: earnedVEs > 0 ? `+${amount} XP & +${earnedVEs} VEs` : `+${amount} XP`,
      icon: earnedVEs > 0 ? 'Coins' : 'Sparkles',
      color: earnedVEs > 0 ? '#fbbf24' : '#38bdf8',
    };

    setHistory((prev) => [newActivity, ...prev]);
  }, [triggerLevelUpCelebration]);

  const completeActivity = (activityId) => {
    const act = activities.find((a) => a.id === activityId);
    if (!act || act.completed) return;

    soundFx.playXP();
    addXP(act.rewardXP, act.title, act.rewardVE || 0);

    setActivities((prev) =>
      prev.map((a) => (a.id === activityId ? { ...a, completed: true } : a))
    );

    setUser((prev) => ({
      ...prev,
      tasksDone: Math.min(prev.totalTasks, prev.tasksDone + 1),
    }));

    showToast(`Claimed +${act.rewardXP} XP from ${act.title}!`);
  };

  const handleGameFinish = (finalScore) => {
    setGameScore(finalScore);
    const xpReward = Math.max(15, Math.floor(finalScore * 0.35));
    const veReward = Math.max(5, Math.floor(finalScore * 0.15));

    setGameRewards({ xp: xpReward, ves: veReward });

    if (finalScore > gameHighScore) {
      setGameHighScore(finalScore);
    }

    setGameState('result');
    soundFx.playMultiplier();
    addXP(xpReward, 'XP Catcher Mini-Game', veReward);
  };

  const claimLevelRewards = () => {
    if (levelUpData) {
      soundFx.playCoin();
      setUser((prev) => ({
        ...prev,
        veCoins: prev.veCoins + levelUpData.rewardVEs,
        gems: prev.gems + levelUpData.rewardGems,
      }));
      showToast(`+${levelUpData.rewardVEs} VEs and +${levelUpData.rewardGems} Gems added to your wallet!`);
    }
    setIsLevelUpModalOpen(false);
  };

  return {
    user,
    setUser,
    levelTiers: LEVEL_TIERS,
    activities,
    history,
    setHistory,
    isGameOpen,
    setIsGameOpen,
    gameState,
    setGameState,
    gameScore,
    gameHighScore,
    gameRewards,
    handleGameFinish,
    isLevelUpModalOpen,
    setIsLevelUpModalOpen,
    levelUpData,
    claimLevelRewards,
    activeTab,
    setActiveTab,
    completeActivity,
    addXP,
    viewState,
    setViewState,
    toastMessage,
    showToast,
    isActivityModalOpen,
    setIsActivityModalOpen,
    selectedActivity,
    setSelectedActivity,
  };
}
