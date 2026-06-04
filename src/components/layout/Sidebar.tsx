import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActivePage } from '../../types';
import {
  LayoutDashboard, Dumbbell, Apple, Brain, BarChart3,
  Trophy, Watch, User, Settings, Activity, LogOut, X, Zap
} from 'lucide-react';

const navItems: { id: ActivePage; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'workouts', label: 'Workouts', icon: <Dumbbell className="w-5 h-5" /> },
  { id: 'nutrition', label: 'Nutrition', icon: <Apple className="w-5 h-5" /> },
  { id: 'coach', label: 'AI Coach', icon: <Brain className="w-5 h-5" />, badge: 'AI' },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'gamification', label: 'Achievements', icon: <Trophy className="w-5 h-5" /> },
  { id: 'wearables', label: 'Wearables', icon: <Watch className="w-5 h-5" /> },
];

const bottomItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export default function Sidebar() {
  const { activePage, setActivePage, sidebarOpen, setSidebarOpen, user, logout } = useApp();

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <aside className={`
      fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700
      flex flex-col z-30 transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white text-base leading-none">FitTrack AI</h1>
            <p className="text-xs text-green-500 font-medium mt-0.5">AI Fitness Coach</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-4 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700" alt={user.name} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{user.name}</p>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Level {user.gamification.level}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                <span className="text-xs text-green-500 font-medium">{user.gamification.xp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
          {/* XP Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Level {user.gamification.level}</span>
              <span>Level {user.gamification.level + 1}</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                style={{ width: `${(user.gamification.xp % 1000) / 10}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => handleNav(item.id)}
              className={`w-full nav-link ${activePage === item.id ? 'nav-link-active' : ''}`}>
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 space-y-1">
          {bottomItems.map(item => (
            <button key={item.id} onClick={() => handleNav(item.id)}
              className={`w-full nav-link ${activePage === item.id ? 'nav-link-active' : ''}`}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 font-medium">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Streak indicator */}
      {user && user.stats.currentStreak > 0 && (
        <div className="p-4 border-t border-gray-100 dark:border-slate-700">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{user.stats.currentStreak} Day Streak!</p>
              <p className="text-xs text-orange-500/70 dark:text-orange-400/70">Keep it going!</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
