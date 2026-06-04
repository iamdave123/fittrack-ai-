import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Sun, Moon, Bell, Search, Plus } from 'lucide-react';

export default function TopBar() {
  const { toggleTheme, theme, setSidebarOpen, activePage, user, addNotification } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    workouts: 'Workouts',
    nutrition: 'Nutrition Tracker',
    coach: 'AI Fitness Coach',
    analytics: 'Analytics & Reports',
    gamification: 'Achievements',
    wearables: 'Wearable Devices',
    profile: 'My Profile',
    settings: 'Settings',
  };

  const sampleNotifications = [
    { id: 1, text: '🔥 You\'re on a 12-day streak! Keep going!', time: '2m ago', unread: true },
    { id: 2, text: '🏆 New badge earned: "Week Warrior"', time: '1h ago', unread: true },
    { id: 3, text: '💧 Don\'t forget to drink water! 0.7L remaining', time: '3h ago', unread: false },
    { id: 4, text: '🤖 Your AI coach has new recommendations', time: '5h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700 px-4 lg:px-6 py-3">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title */}
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">{pageTitles[activePage] || 'FitTrack AI'}</h1>
          {activePage === 'dashboard' && user && (
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user.name.split(' ')[0]}! 👋
            </p>
          )}
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-slate-700 rounded-xl px-3 py-2 w-48 lg:w-64">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search workouts, meals..."
            className="bg-transparent text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 outline-none flex-1" />
        </div>

        {/* Quick log button */}
        <button
          onClick={() => addNotification('Quick log feature — use the Workouts or Nutrition pages to log activities!', 'info')}
          className="hidden sm:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-3 py-2 rounded-xl transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden lg:inline">Quick Log</span>
        </button>

        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">2 new</span>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-slate-700 max-h-72 overflow-y-auto">
                {sampleNotifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${n.unread ? 'bg-green-50/50 dark:bg-green-900/10' : ''}`}>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{n.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700">
                <button onClick={() => setShowNotifs(false)} className="text-sm text-green-500 hover:text-green-600 font-medium w-full text-center">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        {user && (
          <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
            className="w-9 h-9 rounded-full bg-gray-200 dark:bg-slate-700 cursor-pointer ring-2 ring-green-500/20 hover:ring-green-500/50 transition-all"
            alt={user.name} />
        )}
      </div>
    </header>
  );
}
