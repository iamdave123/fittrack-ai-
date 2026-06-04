import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Bell, Shield, Trash2, Download, ChevronRight, Check } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme, addNotification, logout } = useApp();
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    workoutReminder: true,
    streakAlert: true,
    weeklyReport: true,
    achievements: true,
    aiTips: false,
  });
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');

  const handleNotifToggle = (key: keyof typeof notifications) => {
    setNotifications(p => ({ ...p, [key]: !p[key] }));
    addNotification('Notification preference updated', 'success');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your preferences and account settings</p>
      </div>

      {/* Appearance */}
      <div className="card p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Appearance</h3>
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-purple-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Theme</p>
              <p className="text-xs text-gray-400 capitalize">{theme} mode</p>
            </div>
          </div>
          <button onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-purple-500' : 'bg-gray-200'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">Units</p>
            <p className="text-xs text-gray-400">Weight, height, and distance</p>
          </div>
          <div className="flex bg-gray-100 dark:bg-slate-700 rounded-xl p-1">
            {(['metric', 'imperial'] as const).map(u => (
              <button key={u} onClick={() => { setUnits(u); addNotification(`Switched to ${u} units`, 'info'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                  units === u ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
                }`}>{u}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-green-500" />
          <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
        </div>
        <div className="space-y-1">
          {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, value]) => {
            const labels: Record<string, { label: string; desc: string }> = {
              dailyReminder: { label: 'Daily Activity Reminder', desc: 'Remind me to log my daily activity' },
              workoutReminder: { label: 'Workout Reminder', desc: 'Remind me when it\'s time to exercise' },
              streakAlert: { label: 'Streak Alerts', desc: 'Alert me if I\'m about to lose my streak' },
              weeklyReport: { label: 'Weekly Report', desc: 'Send my weekly progress summary' },
              achievements: { label: 'Achievement Notifications', desc: 'Notify me when I earn badges or level up' },
              aiTips: { label: 'AI Fitness Tips', desc: 'Receive daily personalized tips from AI coach' },
            };
            return (
              <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-700 last:border-0">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{labels[key]?.label}</p>
                  <p className="text-xs text-gray-400">{labels[key]?.desc}</p>
                </div>
                <button onClick={() => handleNotifToggle(key)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-green-500' : 'bg-gray-200 dark:bg-slate-600'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy & Data */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-gray-900 dark:text-white">Privacy & Data</h3>
        </div>
        <div className="space-y-1">
          {[
            { label: 'Export My Data', desc: 'Download all your fitness data as CSV', icon: <Download className="w-4 h-4 text-green-500" />, action: () => addNotification('Data export started — you\'ll receive a download link shortly', 'info') },
            { label: 'Privacy Policy', desc: 'View our privacy policy', icon: <ChevronRight className="w-4 h-4 text-gray-400" />, action: () => addNotification('Opening privacy policy...', 'info') },
            { label: 'Terms of Service', desc: 'View terms of service', icon: <ChevronRight className="w-4 h-4 text-gray-400" />, action: () => addNotification('Opening terms of service...', 'info') },
          ].map((item, i) => (
            <button key={i} onClick={item.action}
              className="w-full flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700/30 -mx-5 px-5 transition-colors">
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white text-sm">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              {item.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="card p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Account</h3>
        <div className="space-y-3">
          <button onClick={() => addNotification('Password reset email sent!', 'success')}
            className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <p className="font-medium text-gray-900 dark:text-white text-sm">Change Password</p>
            <p className="text-xs text-gray-400">Send a password reset email</p>
          </button>
          <button onClick={logout}
            className="w-full text-left px-4 py-3 bg-red-50 dark:bg-red-900/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors border border-red-100 dark:border-red-900/30">
            <p className="font-medium text-red-600 dark:text-red-400 text-sm">Sign Out</p>
            <p className="text-xs text-red-400/70">Sign out of your account</p>
          </button>
          <button onClick={() => addNotification('Account deletion requires email confirmation. Check your inbox.', 'info')}
            className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              <p className="font-medium text-red-500 text-sm">Delete Account</p>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Permanently delete your account and all data</p>
          </button>
        </div>
      </div>

      {/* App Version */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">FitTrack AI v1.0.0 • Built with React + Vite + TailwindCSS</p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">© 2025 FitTrack AI. All rights reserved.</p>
      </div>
    </div>
  );
}
