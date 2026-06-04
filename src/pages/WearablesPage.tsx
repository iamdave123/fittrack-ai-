import React, { useState } from 'react';
import { mockWearables } from '../data/mockData';
import { WearableDevice } from '../types';
import { Watch, Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle, Bluetooth, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';

const platformInfo: Record<WearableDevice['platform'], { description: string; features: string[]; setupSteps: string[] }> = {
  google_fit: {
    description: 'Sync with Google Fit to import steps, heart rate, workouts, and sleep data from Android devices.',
    features: ['Steps & Distance', 'Heart Rate', 'Sleep Tracking', 'Workout History', 'Calories'],
    setupSteps: ['Enable Google Fit on your Android device', 'Grant FitTrack AI access in Google Fit settings', 'Authorize data sharing', 'Sync will begin automatically'],
  },
  samsung_health: {
    description: 'Connect Samsung Health to sync data from Galaxy Watch, Galaxy Ring, and other Samsung devices.',
    features: ['Steps & Activity', 'Heart Rate & SpO2', 'Sleep Analysis', 'Stress Tracking', 'Body Composition'],
    setupSteps: ['Open Samsung Health app', 'Go to Connected Services', 'Add FitTrack AI as a partner app', 'Select data to share'],
  },
  fitbit: {
    description: 'Import comprehensive health data from your Fitbit tracker or smartwatch.',
    features: ['Steps & Floors', 'Heart Rate Zones', 'Sleep Stages', 'Active Minutes', 'Weight & BMI'],
    setupSteps: ['Log into your Fitbit account', 'Go to App Gallery', 'Find FitTrack AI', 'Authorize connection'],
  },
  apple_health: {
    description: 'Sync with Apple Health to import data from iPhone, Apple Watch, and compatible apps.',
    features: ['Activity Rings', 'Heart Rate & HRV', 'Sleep Analysis', 'Workout Routes', 'Mindfulness'],
    setupSteps: ['Open Health app on iPhone', 'Go to Profile > Apps', 'Find FitTrack AI', 'Enable all health categories'],
  },
  garmin: {
    description: 'Connect Garmin Connect to sync advanced fitness metrics from Garmin devices.',
    features: ['VO2 Max', 'Training Load', 'Recovery Time', 'GPS Routes', 'Advanced Sleep'],
    setupSteps: ['Open Garmin Connect app', 'Go to Connected Apps', 'Search for FitTrack AI', 'Authorize data access'],
  },
  polar: {
    description: 'Integrate Polar Flow for precise heart rate training data and recovery insights.',
    features: ['Heart Rate Accuracy', 'Training Load Pro', 'Nightly Recharge', 'Running Power', 'Cardio Load'],
    setupSteps: ['Log into Polar Flow', 'Go to Settings > Connected Services', 'Add FitTrack AI', 'Select sync preferences'],
  },
};

export default function WearablesPage() {
  const { addNotification } = useApp();
  const [devices, setDevices] = useState(mockWearables);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleConnect = async (deviceId: string) => {
    setSyncing(deviceId);
    await new Promise(r => setTimeout(r, 2000));
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, connected: true, lastSync: new Date().toISOString() } : d));
    setSyncing(null);
    const device = devices.find(d => d.id === deviceId);
    addNotification(`${device?.name} connected successfully! 🎉`, 'success');
  };

  const handleDisconnect = (deviceId: string) => {
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, connected: false, lastSync: undefined } : d));
    const device = devices.find(d => d.id === deviceId);
    addNotification(`${device?.name} disconnected`, 'info');
  };

  const handleSync = async (deviceId: string) => {
    setSyncing(deviceId);
    await new Promise(r => setTimeout(r, 1500));
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, lastSync: new Date().toISOString() } : d));
    setSyncing(null);
    addNotification('Data synced successfully! ✅', 'success');
  };

  const connectedCount = devices.filter(d => d.connected).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Wearable Devices</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {connectedCount} device{connectedCount !== 1 ? 's' : ''} connected • Sync your health data automatically
        </p>
      </div>

      {/* Status Banner */}
      <div className={`card p-4 flex items-center gap-4 ${connectedCount > 0 ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-slate-700/30'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${connectedCount > 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-slate-700'}`}>
          <Bluetooth className={`w-5 h-5 ${connectedCount > 0 ? 'text-green-500' : 'text-gray-400'}`} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 dark:text-white text-sm">
            {connectedCount > 0 ? `${connectedCount} device${connectedCount > 1 ? 's' : ''} syncing data` : 'No devices connected'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {connectedCount > 0 ? 'Your health data is being automatically imported' : 'Connect a device to automatically import your health data'}
          </p>
        </div>
        {connectedCount > 0 && (
          <div className="flex items-center gap-1 text-green-500">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">Active</span>
          </div>
        )}
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map(device => {
          const info = platformInfo[device.platform];
          const isExpanded = expanded === device.id;
          const isSyncing = syncing === device.id;

          return (
            <div key={device.id} className={`card overflow-hidden transition-all ${device.connected ? 'border-green-200 dark:border-green-800' : ''}`}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${device.color} rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
                      {device.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{device.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {device.connected ? (
                          <>
                            <Wifi className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-500 font-medium">Connected</span>
                          </>
                        ) : (
                          <>
                            <WifiOff className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">Not connected</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{info.description}</p>

                {device.connected && device.lastSync && (
                  <div className="flex items-center gap-1.5 mb-4 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-xs text-green-600 dark:text-green-400">
                      Last sync: {new Date(device.lastSync).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                <div className="flex gap-2">
                  {device.connected ? (
                    <>
                      <button onClick={() => handleSync(device.id)} disabled={isSyncing}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-semibold py-2 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors disabled:opacity-60">
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Syncing...' : 'Sync Now'}
                      </button>
                      <button onClick={() => handleDisconnect(device.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 text-xs font-semibold py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleConnect(device.id)} disabled={isSyncing}
                      className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1.5 disabled:opacity-60">
                      {isSyncing ? (
                        <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Connecting...</>
                      ) : (
                        <><Smartphone className="w-3.5 h-3.5" /> Connect</>
                      )}
                    </button>
                  )}
                  <button onClick={() => setExpanded(isExpanded ? null : device.id)}
                    className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                    {isExpanded ? 'Less' : 'Setup'}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 dark:border-slate-700 p-5 bg-gray-50 dark:bg-slate-700/30">
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">Synced Data</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {info.features.map(f => (
                        <span key={f} className="bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-slate-600">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">Setup Steps</h5>
                    <div className="space-y-1.5">
                      {info.setupSteps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Data Privacy Note */}
      <div className="card p-4 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-300 text-sm">Data Privacy & Security</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 leading-relaxed">
              FitTrack AI uses OAuth 2.0 for secure device connections. Your health data is encrypted in transit and at rest.
              We never sell your personal health data to third parties. You can revoke access at any time from your device's health app settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
