import React from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import NotificationToast from '../ui/NotificationToast';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <TopBar />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      <NotificationToast />
    </div>
  );
}
