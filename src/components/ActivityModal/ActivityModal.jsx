import React, { useState } from 'react';
import styles from './ActivityModal.module.css';
import { 
  X, 
  ArrowLeft, 
  Play, 
  ListChecks, 
  Users, 
  Gamepad2, 
  Magnet, 
  Flame, 
  ChevronRight, 
  Check, 
  Sparkles, 
  Copy, 
  Zap, 
  BarChart2,
  Gift
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const ICON_MAP = {
  'watch-earn': Play,
  'daily-tasks': ListChecks,
  'refer-earn': Users,
  'mini-games': Gamepad2,
  'streak-bonus': Flame,
  'xp-catcher': Magnet,
};

export function ActivityModal({ 
  isOpen, 
  onClose, 
  activities, 
  onCompleteActivity, 
  onOpenGame, 
  selectedActivity, 
  setSelectedActivity 
}) {
  const [copied, setCopied] = useState(false);
  const [adPlaying, setAdPlaying] = useState(false);
  const [adProgress, setAdProgress] = useState(0);

  if (!isOpen) return null;

  const handleWatchAd = (activity) => {
    setAdPlaying(true);
    setAdProgress(0);
    const interval = setInterval(() => {
      setAdProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAdPlaying(false);
          onCompleteActivity(activity.id);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  const handleCopyLink = () => {
    setCopied(true);
    soundFx.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <button 
            className={styles.backBtn}
            onClick={() => {
              soundFx.playClick();
              if (selectedActivity) {
                setSelectedActivity(null);
              } else {
                onClose();
              }
            }}
          >
            <ArrowLeft size={20} />
          </button>

          <div className={styles.headerText}>
            <h3>EARN & LEVEL UP</h3>
            <p>Complete missions, earn XP, and unlock VIP perks</p>
          </div>

          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content View */}
        <div className={styles.modalBody}>
          {selectedActivity ? (
            /* Single Activity Interactive View */
            <div className={styles.singleActivityView}>
              <div 
                className={styles.bigIconCircle}
                style={{ 
                  background: `${selectedActivity.accentColor}20`, 
                  borderColor: selectedActivity.accentColor,
                  color: selectedActivity.accentColor 
                }}
              >
                <Zap size={32} />
              </div>

              <h4>{selectedActivity.title}</h4>
              <p className={styles.singleDesc}>{selectedActivity.subtitle}</p>

              <div className={styles.rewardHighlight}>
                <span className={styles.rewardPillBig}>
                  +{selectedActivity.rewardXP} XP Experience
                </span>
                {selectedActivity.rewardVE > 0 && (
                  <span className={styles.rewardPillVE}>
                    +{selectedActivity.rewardVE} VEs
                  </span>
                )}
              </div>

              {/* Action content per type */}
              {selectedActivity.type === 'ad' && (
                <div className={styles.interactiveBox}>
                  {adPlaying ? (
                    <div className={styles.adSimBox}>
                      <span className={styles.adTag}>Playing Sponsor Video Stream...</span>
                      <div className={styles.adTrack}>
                        <div className={styles.adFill} style={{ width: `${adProgress}%` }}></div>
                      </div>
                      <span className={styles.adPercent}>{adProgress}% Completed</span>
                    </div>
                  ) : (
                    <button 
                      className={styles.actionBtnPrimary}
                      onClick={() => handleWatchAd(selectedActivity)}
                      disabled={selectedActivity.completed}
                    >
                      <Play size={18} fill="#fff" />
                      <span>{selectedActivity.completed ? 'Completed for Today' : 'Watch 15s Video (+50 XP)'}</span>
                    </button>
                  )}
                </div>
              )}

              {selectedActivity.type === 'referral' && (
                <div className={styles.referralBox}>
                  <p className={styles.referralHint}>Share your unique link with friends to earn +100 XP each:</p>
                  <div className={styles.linkCopyRow}>
                    <input 
                      type="text" 
                      readOnly 
                      value="https://veloop.io/ref/velooper_pro" 
                      className={styles.linkInput} 
                    />
                    <button className={styles.copyBtn} onClick={handleCopyLink}>
                      {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <button 
                    className={styles.actionBtnPrimary}
                    onClick={() => onCompleteActivity(selectedActivity.id)}
                    disabled={selectedActivity.completed}
                  >
                    <span>{selectedActivity.completed ? 'Referral Bonus Claimed' : 'Simulate Friend Signup (+100 XP)'}</span>
                  </button>
                </div>
              )}

              {selectedActivity.type === 'game' && (
                <div className={styles.interactiveBox}>
                  <p className={styles.gameHint}>Play the rapid 20-second XP Catcher arcade game to score high and earn instant rewards!</p>
                  <button 
                    className={styles.actionBtnPrimary}
                    onClick={() => {
                      onClose();
                      onOpenGame();
                    }}
                  >
                    <Gamepad2 size={18} />
                    <span>Launch XP Catcher Arcade</span>
                  </button>
                </div>
              )}

              {(selectedActivity.type === 'mission' || selectedActivity.type === 'arcade' || selectedActivity.type === 'streak') && (
                <div className={styles.interactiveBox}>
                  <button 
                    className={styles.actionBtnPrimary}
                    onClick={() => onCompleteActivity(selectedActivity.id)}
                    disabled={selectedActivity.completed}
                  >
                    <Check size={18} />
                    <span>{selectedActivity.completed ? 'Task Already Completed' : `Complete Task (+${selectedActivity.rewardXP} XP)`}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Full Activity List View */
            <div className={styles.activityList}>
              {[
                { id: 'watch-earn', title: 'Watch & Earn', subtitle: 'Watch ads and earn', rewardXP: 50, color: '#8b5cf6', icon: Play },
                { id: 'daily-tasks', title: 'Daily Missions', subtitle: 'Complete daily tasks', rewardXP: 30, color: '#22c55e', icon: ListChecks },
                { id: 'refer-earn', title: 'Refer & Earn', subtitle: 'Invite friends & earn', rewardXP: 100, color: '#f97316', icon: Users },
                { id: 'mini-games', title: 'Mini Games', subtitle: 'Play games & win', rewardXP: 75, color: '#3b82f6', icon: Gamepad2 },
                { id: 'streak-bonus', title: 'Streak Bonus', subtitle: 'Maintain your streak', rewardXP: 25, color: '#ef4444', icon: Flame },
                { id: 'xp-catcher', title: 'XP Catcher', subtitle: 'Catch orbs & coins', rewardXP: 10, color: '#0284c7', icon: Magnet, isGame: true },
              ].map((item) => {
                const activityData = activities.find(a => a.id === item.id) || item;
                const IconComp = item.icon;
                const isCompleted = activityData.completed;

                return (
                  <div
                    key={item.id}
                    className={`${styles.itemCard} ${isCompleted ? styles.itemDone : ''}`}
                    onClick={() => {
                      soundFx.playClick();
                      if (item.isGame || item.id === 'xp-catcher') {
                        onClose();
                        onOpenGame();
                      } else {
                        setSelectedActivity(activityData);
                      }
                    }}
                  >
                    <div 
                      className={styles.itemIconCircle}
                      style={{ 
                        background: `${item.color}20`, 
                        borderColor: `${item.color}50`,
                        color: item.color 
                      }}
                    >
                      {isCompleted ? <Check size={18} color="#10b981" /> : <IconComp size={18} />}
                    </div>

                    <div className={styles.itemMeta}>
                      <span className={styles.itemTitle}>{item.title}</span>
                      <span className={styles.itemSubtitle}>{item.subtitle}</span>
                      <span className={styles.itemReward}>+{item.rewardXP} XP</span>
                    </div>

                    <ChevronRight size={16} className={styles.arrowIcon} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Motivational Footer */}
        <div className={styles.modalFooter}>
          <span className={styles.footerText}>
            ⚡ Keep going! You are close to Level 06!
          </span>
          <div className={styles.signalIcon}>
            <BarChart2 size={18} color="var(--accent-gold)" />
          </div>
        </div>
      </div>
    </div>
  );
}
