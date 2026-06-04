import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Theme, ActivePage, DailyActivity, Meal } from '../types';
import { mockUser, todayActivity, mockMeals } from '../data/mockData';

interface AppContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;

  // Theme
  theme: Theme;
  toggleTheme: () => void;

  // Navigation
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Activity
  todayActivity: DailyActivity;
  updateTodayActivity: (updates: Partial<DailyActivity>) => void;

  // Meals
  meals: Meal[];
  addMeal: (meal: Meal) => void;
  removeMeal: (id: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (msg: string, type?: 'success' | 'error' | 'info') => void;
  clearNotification: (id: string) => void;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activity, setActivity] = useState<DailyActivity>(todayActivity);
  const [meals, setMeals] = useState<Meal[]>(mockMeals);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load persisted auth
  useEffect(() => {
    const savedAuth = localStorage.getItem('fittrack_auth');
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      setUser(parsed.user);
      setIsAuthenticated(true);
    }
    const savedTheme = localStorage.getItem('fittrack_theme') as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    const userData = { ...mockUser, email };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('fittrack_auth', JSON.stringify({ user: userData }));
    addNotification('Welcome back, ' + userData.name + '! 🎉', 'success');
    return true;
  };

  const register = async (name: string, email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1000));
    const newUser = {
      ...mockUser,
      id: Date.now().toString(),
      name,
      email,
      joinDate: new Date().toISOString().split('T')[0],
      stats: { ...mockUser.stats, totalWorkouts: 0, currentStreak: 0 },
      gamification: { xp: 0, level: 1, badges: [], completedChallenges: [], rank: 999 },
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('fittrack_auth', JSON.stringify({ user: newUser }));
    addNotification('Welcome to FitTrack AI, ' + name + '! Let\'s start your journey! 🚀', 'success');
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fittrack_auth');
    setActivePage('dashboard');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('fittrack_auth', JSON.stringify({ user: updated }));
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('fittrack_theme', newTheme);
  };

  const updateTodayActivity = (updates: Partial<DailyActivity>) => {
    setActivity(prev => ({ ...prev, ...updates }));
  };

  const addMeal = (meal: Meal) => {
    setMeals(prev => [...prev, meal]);
    addNotification('Meal logged successfully! 🥗', 'success');
  };

  const removeMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => clearNotification(id), 4000);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AppContext.Provider value={{
      user, isAuthenticated, login, register, logout, updateUser,
      theme, toggleTheme,
      activePage, setActivePage, sidebarOpen, setSidebarOpen,
      todayActivity: activity, updateTodayActivity,
      meals, addMeal, removeMeal,
      notifications, addNotification, clearNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
