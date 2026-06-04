import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell
} from 'recharts';
import { generateWeeklyData, fitnessInsights } from '../data/mockData';
import {
  Footprints, Flame, Droplets, Moon, Dumbbell, Scale,
  TrendingUp, TrendingDown, Target, Zap, Award, ChevronRight, Plus
} from 'lucide-react';

const weeklyData = generateWeeklyData();

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

function StatCard({ icon, label, value, unit, progress, target, color, trend }: {
  icon: React.ReactNode; label: string; value: string | number; unit: string;
  progress: number; target: string; color: string; trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="card card-hover p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
            {trend === 'up' ? '+8%' : trend === 'down' ? '-3%' : ''}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
          <span className="text-sm font-medium text-gray-400 ml-1">{unit}</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{Math.round(progress)}% of goal</span>
          <span>Target: {target}</span>
        </div>
        <div className="progress-bar">
          <div className={`progress-fill ${progress >= 100 ? 'bg-green-500' : progress >= 70 ? 'bg-blue-500' : progress >= 40 ? 'bg-yellow-500' : 'bg-red-400'}`}
            style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}

function GoalRing({ label, value, color }: { label: string; value: number; color: string }) {
  const data = [{ value }, { value: 100 - value }];
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <PieChart width={64} height={64}>
          <Pie data={data} cx={28} cy={28} innerRadius={22} outerRadius={30} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
            <Cell fill={color} />
            <Cell fill="transparent" className="dark:fill-slate-700 fill-gray-100" />
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight">{label}</span>
    </div>
  );
}

export default function Dashboard() {
  const { user, todayActivity } = useApp();
  const [activeChart, setActiveChart] = useState<'steps' | 'calories' | 'sleep' | 'water'>('steps');

  if (!user) return null;

  const { profile, stats } = user;
  const stepsProgress = (todayActivity.steps / profile.dailyStepsTarget) * 100;
  const caloriesProgress = (todayActivity.caloriesBurned / 600) * 100;
  const waterProgress = (todayActivity.waterIntake / profile.dailyWaterTarget) * 100;
  const sleepProgress = (todayActivity.sleepHours / profile.dailySleepTarget) * 100;

  const chartColors: Record<string, string> = {
    steps: '#22c55e', calories: '#f59e0b', sleep: '#8b5cf6', water: '#3b82f6'
  };

  const chartData = weeklyData.map(d => ({
    ...d,
    stepsProgress: Math.round((d.steps / profile.dailyStepsTarget) * 100),
  }));

  const macroData = [
    { name: 'Protein', value: 146, color: '#22c55e', target: 150 },
    { name: 'Carbs', value: 164, color: '#3b82f6', target: 220 },
    { name: 'Fat', value: 60, color: '#f59e0b', target: 70 },
  ];

  const goalRings = [
    { label: 'Steps', value: Math.min(Math.round(stepsProgress), 100), color: '#22c55e' },
    { label: 'Calories', value: Math.min(Math.round(caloriesProgress), 100), color: '#f59e0b' },
    { label: 'Water', value: Math.min(Math.round(waterProgress), 100), color: '#3b82f6' },
    { label: 'Sleep', value: Math.min(Math.round(sleepProgress), 100), color: '#8b5cf6' },
    { label: 'Workout', value: todayActivity.workouts.length > 0 ? 100 : 0, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white rounded-full translate-y-1/2" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user.name.split(' ')[0]}! 💪
            </h2>
            <p className="text-green-100 text-sm">
              You're on a <strong className="text-white">{stats.currentStreak}-day streak</strong>! Keep pushing — you're {Math.round((stats.weeklyWorkouts / profile.weeklyWorkoutTarget) * 100)}% toward your weekly goal.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">🔥 {stats.currentStreak}</p>
              <p className="text-green-200 text-xs">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.weeklyWorkouts}/{profile.weeklyWorkoutTarget}</p>
              <p className="text-green-200 text-xs">This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Rings */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Today's Goals</h3>
          <span className="text-xs text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center justify-around">
          {goalRings.map(g => <GoalRing key={g.label} {...g} />)}
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={<Footprints className="w-5 h-5 text-green-600" />} label="Steps Today"
          value={todayActivity.steps} unit="steps" progress={stepsProgress}
          target={profile.dailyStepsTarget.toLocaleString()} color="bg-green-100 dark:bg-green-900/30" trend="up" />
        <StatCard icon={<Flame className="w-5 h-5 text-orange-600" />} label="Calories Burned"
          value={todayActivity.caloriesBurned} unit="kcal" progress={caloriesProgress}
          target="600" color="bg-orange-100 dark:bg-orange-900/30" trend="up" />
        <StatCard icon={<Droplets className="w-5 h-5 text-blue-600" />} label="Water Intake"
          value={todayActivity.waterIntake} unit="L" progress={waterProgress}
          target={`${profile.dailyWaterTarget}L`} color="bg-blue-100 dark:bg-blue-900/30" trend="neutral" />
        <StatCard icon={<Moon className="w-5 h-5 text-purple-600" />} label="Sleep"
          value={todayActivity.sleepHours} unit="hrs" progress={sleepProgress}
          target={`${profile.dailySleepTarget}h`} color="bg-purple-100 dark:bg-purple-900/30" trend="neutral" />
        <StatCard icon={<Dumbbell className="w-5 h-5 text-red-600" />} label="Workouts"
          value={todayActivity.workouts.length} unit="done" progress={todayActivity.workouts.length > 0 ? 100 : 0}
          target="1" color="bg-red-100 dark:bg-red-900/30" trend="up" />
        <StatCard icon={<Scale className="w-5 h-5 text-teal-600" />} label="Weight"
          value={todayActivity.weight || user.profile.weight} unit="kg" progress={75}
          target={`${profile.targetWeight || profile.weight}kg`} color="bg-teal-100 dark:bg-teal-900/30" trend="down" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Weekly Activity</h3>
            <div className="flex gap-1">
              {(['steps', 'calories', 'sleep', 'water'] as const).map(k => (
                <button key={k} onClick={() => setActiveChart(k)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors capitalize ${
                    activeChart === k ? 'bg-green-500 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}>
                  {k}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors[activeChart]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColors[activeChart]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--tw-bg, #1e293b)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey={activeChart} stroke={chartColors[activeChart]} strokeWidth={2.5}
                fill="url(#colorGrad)" dot={{ fill: chartColors[activeChart], strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Macros */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Today's Macros</h3>
            <span className="text-xs text-gray-400">1,920 / {profile.dailyCaloriesTarget} kcal</span>
          </div>
          <div className="space-y-4">
            {macroData.map(m => (
              <div key={m.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{m.name}</span>
                  <span className="text-gray-500 dark:text-gray-400">{m.value}g / {m.target}g</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min((m.value / m.target) * 100, 100)}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            <div className="flex justify-around text-center">
              {macroData.map(m => (
                <div key={m.name}>
                  <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}g</p>
                  <p className="text-xs text-gray-400">{m.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Workout */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Today's Workout</h3>
            <button className="text-green-500 hover:text-green-600 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {todayActivity.workouts.length > 0 ? (
            <div className="space-y-3">
              {todayActivity.workouts.map(w => (
                <div key={w.id} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💪</span>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">{w.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      w.intensity === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                      w.intensity === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    }`}>{w.intensity}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>⏱ {w.duration} min</span>
                    <span>🔥 {w.caloriesBurned} kcal</span>
                    <span>📋 {w.exercises?.length || 0} exercises</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Dumbbell className="w-10 h-10 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No workout logged yet</p>
              <button className="mt-2 text-green-500 text-sm font-semibold hover:text-green-600">Log a workout →</button>
            </div>
          )}
        </div>

        {/* Weekly Workout Bars */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Workout Minutes</h3>
            <span className="text-xs text-gray-400">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="workoutMinutes" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fitness Insights */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Fitness Insights</h3>
            <Target className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {fitnessInsights.map((insight, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-slate-700 last:border-0">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{insight.label}</p>
                  <p className="font-bold text-gray-900 dark:text-white">{insight.value}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold ${insight.color}`}>{insight.status}</span>
                  <p className="text-xs text-gray-400 capitalize">{insight.trend}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full flex items-center justify-center gap-2 text-green-500 text-sm font-semibold hover:text-green-600 transition-colors">
            View full report <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: '🏋️', label: 'Total Workouts', value: stats.totalWorkouts.toLocaleString(), color: 'from-green-500 to-emerald-600' },
          { icon: '🔥', label: 'Calories Burned', value: `${(stats.totalCaloriesBurned / 1000).toFixed(1)}k`, color: 'from-orange-500 to-red-500' },
          { icon: '👟', label: 'Total Steps', value: `${(stats.totalSteps / 1000000).toFixed(2)}M`, color: 'from-blue-500 to-cyan-500' },
          { icon: '⚡', label: 'Best Streak', value: `${stats.longestStreak} days`, color: 'from-purple-500 to-violet-600' },
        ].map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-white/80 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
