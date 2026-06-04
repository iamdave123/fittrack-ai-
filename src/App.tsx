import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AuthPage from './pages/AuthPage';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import WorkoutsPage from './pages/WorkoutsPage';
import NutritionPage from './pages/NutritionPage';
import AICoachPage from './pages/AICoachPage';
import AnalyticsPage from './pages/AnalyticsPage';
import GamificationPage from './pages/GamificationPage';
import WearablesPage from './pages/WearablesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const { isAuthenticated, activePage } = useApp();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'workouts': return <WorkoutsPage />;
      case 'nutrition': return <NutritionPage />;
      case 'coach': return <AICoachPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'gamification': return <GamificationPage />;
      case 'wearables': return <WearablesPage />;
      case 'profile': return <ProfilePage />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
