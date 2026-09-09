import { useState, useCallback, useEffect } from 'react';
import { INITIAL_USER, LEVEL_TIERS, EARN_ACTIVITIES, INITIAL_ACTIVITY_HISTORY } from '../data/mockData';
import { soundFx } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export function useProgression() {
  const [user, setUser] = useState(INITIAL_USER);
  const [activities, setActivities] = useState(EARN_ACTIVITIES);
  const [history, setHistory] = useState(INITIAL_ACTIVITY_HISTORY);
  
  // Theme state
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('veloop_theme') || 'aurora';
  });

  const [isGameOpen, setIsGameOpen] = useState(false);
  const [gameState, setGameState] = useState('start');
  const [gameScore, setGameScore] = useState(0);
  const [gameHighScore, setGameHighScore] = useState(92);
  const [gameRewards, setGameRewards] = useState({ xp: 30, ves: 12 });
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [viewState, setViewState] = useState('normal');
  const [toastMessage, setToastMessage] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isStreakClaimed, setIsStreakClaimed] = useState(false);

  // Apply theme to document
  useEffect(() => {
    if (currentTheme === 'aurora') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', currentTheme);
    }
    localStorage.setItem('veloop_theme', currentTheme);
  }, [currentTheme]);

  const switchTheme = useCallback((themeName) => {
    soundFx.playThemeSwitch();
    setCurrentTheme(themeName);
    showToast(`Theme switched to ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}!`);
  }, []);

  const toggleSound = useCallback(() => {
    const nextMute = !isMuted;
    soundFx.muted = nextMute;
    setIsMuted(nextMute);
    if (!nextMute) soundFx.playClick();
  }, [isMuted]);

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
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#f59e0b', '#a855f7', '#10b981', '#ec4899'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const addXP = useCallback((amount, sourceName = 'Reward', earnedVEs = 0, earnedGems = 0) => {
    setUser((prev) => {
      const newXP = prev.currentXP + amount;
      const newTodayXP = prev.todayXP + amount;
      const newVEs = prev.veCoins + earnedVEs;
      const newTodayVEs = prev.todayVEs + earnedVEs;
      const newGems = prev.gems + earnedGems;
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
          gems: newGems,
        };
      }

      return {
        ...prev,
        currentXP: newXP,
        todayXP: newTodayXP,
        veCoins: newVEs,
        todayVEs: newTodayVEs,
        gems: newGems,
      };
    });

    const newActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: amount > 0 ? `+${amount} XP` : `+${earnedVEs} VEs`,
      subtitle: `${sourceName}`,
      time: 'Just now',
      type: amount > 0 ? 'xp' : 've',
      category: sourceName.toLowerCase().includes('game') ? 'game' : 'task',
      amount: amount > 0 ? `+${amount} XP` : `+${earnedVEs} VEs`,
      icon: sourceName.toLowerCase().includes('game') ? 'Gamepad2' : 'CheckCircle2',
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

  const claimStreakBonus = useCallback(() => {
    if (isStreakClaimed) return;
    soundFx.playStreak();
    setIsStreakClaimed(true);
    addXP(50, '7-Day Streak Bonus', 10, 2);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ef4444', '#f59e0b', '#ffd700'],
      });
    } catch {}
    showToast('🔥 Streak Bonus Claimed: +50 XP, +10 VEs, +2 Gems!');
  }, [isStreakClaimed, addXP, showToast]);

  const handleHeroEnergyTap = useCallback(() => {
    soundFx.playXP();
    addXP(5, 'Energy Boost Tap', 0);
    showToast('⚡ +5 XP Energy Boost Surge!');
  }, [addXP, showToast]);

  const handleRewardWon = useCallback((prize) => {
    if (prize.type === 'xp') {
      addXP(prize.value, 'Lucky Wheel Fortune');
    } else if (prize.type === 've') {
      addXP(0, 'Lucky Wheel Fortune', prize.value);
    } else if (prize.type === 'gem') {
      addXP(0, 'Lucky Wheel Fortune', 0, prize.value);
    } else if (prize.type === 'chest') {
      addXP(prize.xp, 'Ancient Vault Loot', prize.ves, prize.gems);
    } else {
      addXP(75, 'Mystery Prize Won', 20, 3);
    }
  }, [addXP]);

  const handleGameFinish = (finalScore) => {
    setGameScore(finalScore);
    const xpReward = Math.max(20, Math.floor(finalScore * 0.4));
    const veReward = Math.max(5, Math.floor(finalScore * 0.2));

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
    currentTheme,
    switchTheme,
    isMuted,
    toggleSound,
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
    isLuckyWheelOpen,
    setIsLuckyWheelOpen,
    selectedActivity,
    setSelectedActivity,
    isStreakClaimed,
    claimStreakBonus,
    handleHeroEnergyTap,
    handleRewardWon,
  };
}
