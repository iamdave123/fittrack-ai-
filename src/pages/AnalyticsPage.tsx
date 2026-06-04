import React, { useState } from 'react';
import { generateWeeklyData, generateMonthlyData, generateYearlyData, weeklyReport } from '../data/mockData';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ComposedChart
} from 'recharts';
import { TrendingDown, TrendingUp, Calendar, Download, CheckCircle, AlertCircle } from 'lucide-react';

const weeklyData = generateWeeklyData();
const monthlyData = generateMonthlyData();
const yearlyData = generateYearlyData();

type Period = 'weekly' | 'monthly' | 'yearly';
type Metric = 'weight' | 'steps' | 'calories' | 'workouts';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('weekly');
  const [metric, setMetric] = useState<Metric>('weight');

  const data: any[] = period === 'weekly' ? weeklyData : period === 'monthly' ? monthlyData : yearlyData;
  const xKey = period === 'weekly' ? 'day' : period === 'monthly' ? 'date' : 'month';

  const metricConfig: Record<Metric, { color: string; label: string; dataKey: string; unit: string }> = {
    weight: { color: '#22c55e', label: 'Weight', dataKey: 'weight', unit: 'kg' },
    steps: { color: '#3b82f6', label: 'Steps', dataKey: 'steps', unit: 'steps' },
    calories: { color: '#f59e0b', label: 'Calories', dataKey: 'calories', unit: 'kcal' },
    workouts: { color: '#8b5cf6', label: 'Workouts', dataKey: 'workouts', unit: '' },
  };

  const mc = metricConfig[metric];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track your long-term fitness trends</p>
        </div>
        <button className="btn-outline flex items-center gap-2 self-start sm:self-auto text-sm">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Weekly Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Workouts', value: weeklyReport.totalWorkouts, unit: 'sessions', trend: 'up', change: '+1 vs last week', color: 'text-green-500' },
          { label: 'Calories Burned', value: weeklyReport.totalCaloriesBurned.toLocaleString(), unit: 'kcal', trend: 'up', change: '+340 vs last week', color: 'text-orange-500' },
          { label: 'Avg Daily Steps', value: weeklyReport.avgDailySteps.toLocaleString(), unit: 'steps', trend: 'up', change: '+820 vs last week', color: 'text-blue-500' },
          { label: 'Weight Change', value: weeklyReport.weightChange, unit: 'kg', trend: 'down', change: 'On track for goal', color: 'text-green-500' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
            <div className="flex items-end gap-1">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              {s.unit && <p className="text-xs text-gray-400 mb-1">{s.unit}</p>}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {s.trend === 'up' ? <TrendingUp className="w-3 h-3 text-green-500" /> : <TrendingDown className="w-3 h-3 text-green-500" />}
              <p className="text-xs text-gray-400">{s.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h3 className="font-bold text-gray-900 dark:text-white">Progress Trends</h3>
          <div className="flex flex-wrap gap-2">
            {/* Period Toggle */}
            <div className="flex bg-gray-100 dark:bg-slate-700 rounded-xl p-1">
              {(['weekly', 'monthly', 'yearly'] as Period[]).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                    period === p ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
                  }`}>{p}</button>
              ))}
            </div>
            {/* Metric Toggle */}
            <div className="flex bg-gray-100 dark:bg-slate-700 rounded-xl p-1">
              {(Object.keys(metricConfig) as Metric[]).map(m => (
                <button key={m} onClick={() => setMetric(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                    metric === m ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
                  }`}>{m}</button>
              ))}
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          {metric === 'workouts' ? (
            <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={mc.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={mc.color} stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" vertical={false} />
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey={mc.dataKey} fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={mc.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={mc.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey={mc.dataKey} stroke={mc.color} strokeWidth={2.5}
                fill="url(#areaGrad)" dot={{ fill: mc.color, strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Multi-metric Chart */}
      <div className="card p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-5">Weekly Overview — All Metrics</h3>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar yAxisId="left" dataKey="workoutMinutes" fill="#22c55e" radius={[4, 4, 0, 0]} name="Workout Min" opacity={0.8} />
            <Line yAxisId="right" type="monotone" dataKey="steps" stroke="#3b82f6" strokeWidth={2} dot={false} name="Steps" />
            <Line yAxisId="right" type="monotone" dataKey="calories" stroke="#f59e0b" strokeWidth={2} dot={false} name="Calories" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Yearly Weight Trend */}
      <div className="card p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-5">Yearly Weight Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={yearlyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} formatter={(v: any) => [`${v} kg`, 'Weight']} />
            <Line type="monotone" dataKey="avgWeight" stroke="#22c55e" strokeWidth={3}
              dot={{ fill: '#22c55e', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-2 mt-3">
          <TrendingDown className="w-4 h-4 text-green-500" />
          <p className="text-sm text-green-500 font-semibold">-3.6 kg over 12 months — Great progress!</p>
        </div>
      </div>

      {/* Weekly Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-green-500" />
            <h3 className="font-bold text-gray-900 dark:text-white">Weekly Highlights</h3>
          </div>
          <div className="space-y-2">
            {weeklyReport.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{h}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-gray-900 dark:text-white">Areas to Improve</h3>
          </div>
          <div className="space-y-2">
            {weeklyReport.improvements.map((imp, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{imp}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Overall Goal Completion</span>
              <span className="text-lg font-bold text-green-500">{weeklyReport.goalCompletion}%</span>
            </div>
            <div className="progress-bar mt-2">
              <div className="progress-fill bg-green-500" style={{ width: `${weeklyReport.goalCompletion}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
