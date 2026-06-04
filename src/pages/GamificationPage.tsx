import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockBadges, mockChallenges, mockLeaderboard } from '../data/mockData';
import { Trophy, Zap, Star, Crown, Target, Users, Lock } from 'lucide-react';

const rarityConfig = {
  common: { label: 'Common', color: 'border-gray-200 dark:border-slate-600', glow: '' },
  rare: { label: 'Rare', color: 'border-blue-300 dark:border-blue-700', glow: 'shadow-blue-100 dark:shadow-blue-900/30' },
  epic: { label: 'Epic', color: 'border-purple-300 dark:border-purple-700', glow: 'shadow-purple-100 dark:shadow-purple-900/30' },
  legendary: { label: 'Legendary', color: 'border-yellow-300 dark:border-yellow-700', glow: 'shadow-yellow-100 dark:shadow-yellow-900/30' },
};

function XPProgressBar({ xp, level }: { xp: number; level: number }) {
  const xpInLevel = xp % 1000;
  const xpToNext = 1000 - xpInLevel;
  return (
    <div className="card p-5 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-black text-white">{level}</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">Level {level}</p>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              {level < 5 ? 'Fitness Rookie' : level < 10 ? 'Active Athlete' : level < 15 ? 'Fitness Enthusiast' : level < 20 ? 'Elite Trainer' : 'Fitness Legend'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{xp.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Total XP</p>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Level {level}</span>
          <span>{xpInLevel} / 1,000 XP to Level {level + 1}</span>
        </div>
        <div className="h-3 bg-purple-100 dark:bg-purple-900/40 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-700"
            style={{ width: `${xpInLevel / 10}%` }} />
        </div>
        <p className="text-xs text-gray-400 text-right">{xpToNext} XP needed</p>
      </div>
    </div>
  );
}

export default function GamificationPage() {
  const { user, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'challenges' | 'badges' | 'leaderboard'>('challenges');
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'earned' | 'locked'>('all');

  if (!user) return null;

  const earnedBadgeIds = mockBadges.filter(b => b.earnedAt).map(b => b.id);
  const filteredBadges = mockBadges.filter(b => {
    if (badgeFilter === 'earned') return b.earnedAt;
    if (badgeFilter === 'locked') return !b.earnedAt;
    return true;
  });

  const handleCompleteChallenge = (challengeId: string) => {
    addNotification('Challenge completed! +XP earned 🎉', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {earnedBadgeIds.length} badges earned • Rank #{user.gamification.rank} globally
        </p>
      </div>

      {/* XP Progress */}
      <XPProgressBar xp={user.gamification.xp} level={user.gamification.level} />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: <Trophy className="w-5 h-5 text-yellow-500" />, label: 'Badges Earned', value: earnedBadgeIds.length, bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
          { icon: <Zap className="w-5 h-5 text-purple-500" />, label: 'Total XP', value: user.gamification.xp.toLocaleString(), bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { icon: <Crown className="w-5 h-5 text-orange-500" />, label: 'Global Rank', value: `#${user.gamification.rank}`, bg: 'bg-orange-50 dark:bg-orange-900/20' },
          { icon: <Star className="w-5 h-5 text-blue-500" />, label: 'Challenges Done', value: user.gamification.completedChallenges.length, bg: 'bg-blue-50 dark:bg-blue-900/20' },
        ].map((s, i) => (
          <div key={i} className={`card p-4 ${s.bg}`}>
            <div className="flex items-center gap-2 mb-2">{s.icon}</div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
        {([
          { id: 'challenges', label: 'Daily Challenges', icon: <Target className="w-4 h-4" /> },
          { id: 'badges', label: 'Badges', icon: <Trophy className="w-4 h-4" /> },
          { id: 'leaderboard', label: 'Leaderboard', icon: <Users className="w-4 h-4" /> },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}>
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockChallenges.map(ch => {
              const progress = Math.min((ch.current / ch.target) * 100, 100);
              const isCompleted = progress >= 100;
              return (
                <div key={ch.id} className={`card p-5 ${isCompleted ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10' : ''}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${ch.color} rounded-xl flex items-center justify-center text-xl`}>
                        {ch.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{ch.title}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                            ch.type === 'daily' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>{ch.type}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{ch.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-lg">
                      <Zap className="w-3 h-3" />
                      <span className="text-xs font-bold">+{ch.xpReward}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{ch.current} / {ch.target} {ch.unit}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className={`progress-fill ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  {isCompleted && (
                    <button onClick={() => handleCompleteChallenge(ch.id)}
                      className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                      ✓ Claim Reward (+{ch.xpReward} XP)
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div>
          <div className="flex gap-2 mb-4">
            {(['all', 'earned', 'locked'] as const).map(f => (
              <button key={f} onClick={() => setBadgeFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors capitalize ${
                  badgeFilter === f ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}>{f}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBadges.map(badge => {
              const isEarned = !!badge.earnedAt;
              const rarity = rarityConfig[badge.rarity];
              return (
                <div key={badge.id} className={`card p-4 text-center border-2 ${rarity.color} ${rarity.glow} shadow-md transition-all hover:scale-105 ${!isEarned ? 'opacity-50 grayscale' : ''}`}>
                  <div className={`w-14 h-14 ${badge.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 ${!isEarned ? 'relative' : ''}`}>
                    {!isEarned ? (
                      <div className="absolute inset-0 bg-gray-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
                        <Lock className="w-6 h-6 text-gray-400" />
                      </div>
                    ) : badge.icon}
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{badge.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">{badge.description}</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      badge.rarity === 'epic' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      badge.rarity === 'rare' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400'
                    }`}>{rarity.label}</span>
                  </div>
                  {isEarned && badge.earnedAt && (
                    <p className="text-xs text-green-500 mt-1">✓ {new Date(badge.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-slate-700">
            <h3 className="font-bold text-gray-900 dark:text-white">Global Leaderboard</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Weekly rankings by XP earned</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-slate-700">
            {mockLeaderboard.map((entry, i) => (
              <div key={entry.userId} className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                entry.isCurrentUser ? 'bg-green-50 dark:bg-green-900/10' : 'hover:bg-gray-50 dark:hover:bg-slate-700/30'
              }`}>
                {/* Rank */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  entry.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                  entry.rank === 2 ? 'bg-gray-100 text-gray-600' :
                  entry.rank === 3 ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                </div>

                {/* Avatar */}
                <img src={entry.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`}
                  className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 flex-shrink-0" alt={entry.name} />

                {/* Name & Level */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-sm truncate ${entry.isCurrentUser ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                      {entry.name} {entry.isCurrentUser && '(You)'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">Level {entry.level} • {entry.weeklyWorkouts} workouts this week</p>
                </div>

                {/* XP */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                    <Zap className="w-3.5 h-3.5" />
                    <span className="font-bold text-sm">{entry.xp.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-400">XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
