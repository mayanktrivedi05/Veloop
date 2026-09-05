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
  BarChart2
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
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
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
            <p>Complete activities. Earn XP.<br />Climb levels. Get rewards.</p>
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
                <Zap size={30} />
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
                      <span className={styles.adTag}>Playing Sponsor Video...</span>
                      <div className={styles.adTrack}>
                        <div className={styles.adFill} style={{ width: `${adProgress}%` }}></div>
                      </div>
                      <span className={styles.adPercent}>{adProgress}%</span>
                    </div>
                  ) : (
                    <button 
                      className={styles.actionBtnPrimary}
                      onClick={() => handleWatchAd(selectedActivity)}
                      disabled={selectedActivity.completed}
                    >
                      <Play size={18} fill="#fff" />
                      <span>{selectedActivity.completed ? 'Completed for today' : 'Watch 15s Video (+50 XP)'}</span>
                    </button>
                  )}
                </div>
              )}

              {selectedActivity.type === 'referral' && (
                <div className={styles.referralBox}>
                  <p className={styles.referralHint}>Share your unique link with friends:</p>
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
                  <p className={styles.gameHint}>Play the rapid 20-second XP Catcher mini-game to score high and earn instant rewards!</p>
                  <button 
                    className={styles.actionBtnPrimary}
                    onClick={() => {
                      onClose();
                      onOpenGame();
                    }}
                  >
                    <Gamepad2 size={18} />
                    <span>Launch XP Catcher</span>
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
            /* Full Activity List View (matching Screen 4) */
            <div className={styles.activityList}>
              {activities.map((item) => {
                const IconComp = ICON_MAP[item.id] || Sparkles;
                const isCompleted = item.completed;

                return (
                  <div
                    key={item.id}
                    className={`${styles.itemCard} ${isCompleted ? styles.itemDone : ''}`}
                    onClick={() => {
                      soundFx.playClick();
                      if (item.isGame) {
                        onClose();
                        onOpenGame();
                      } else {
                        setSelectedActivity(item);
                      }
                    }}
                  >
                    <div 
                      className={styles.itemIconCircle}
                      style={{ 
                        background: `${item.accentColor}20`, 
                        borderColor: `${item.accentColor}40`,
                        color: item.accentColor 
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

        {/* Motivational Footer (Screen 4) */}
        <div className={styles.modalFooter}>
          <span className={styles.footerText}>
            Keep going! You're doing great!
          </span>
          <div className={styles.signalIcon}>
            <BarChart2 size={18} color="#f59e0b" />
          </div>
        </div>
      </div>
    </div>
  );
}

