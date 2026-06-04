import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast() {
  const { notifications, clearNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {notifications.map(n => (
        <div key={n.id}
          className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-sm animate-slide-up
            ${n.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' :
              n.type === 'error' ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800' :
              'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'}`}>
          <div className="flex-shrink-0 mt-0.5">
            {n.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-500" /> :
             n.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-500" /> :
             <Info className="w-5 h-5 text-blue-500" />}
          </div>
          <p className={`flex-1 text-sm font-medium
            ${n.type === 'success' ? 'text-green-800 dark:text-green-200' :
              n.type === 'error' ? 'text-red-800 dark:text-red-200' :
              'text-blue-800 dark:text-blue-200'}`}>
            {n.message}
          </p>
          <button onClick={() => clearNotification(n.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
