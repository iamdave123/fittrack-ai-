import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Camera, Save, TrendingDown, TrendingUp, Award } from 'lucide-react';
import { mockBadges } from '../data/mockData';

export default function ProfilePage() {
  const { user, updateUser, addNotification } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.profile.age || 25,
    gender: user?.profile.gender || 'male',
    height: user?.profile.height || 175,
    weight: user?.profile.weight || 75,
    activityLevel: user?.profile.activityLevel || 'moderate',
    fitnessGoal: user?.profile.fitnessGoal || 'general_fitness',
    targetWeight: user?.profile.targetWeight || 70,
    weeklyWorkoutTarget: user?.profile.weeklyWorkoutTarget || 4,
    dailyStepsTarget: user?.profile.dailyStepsTarget || 10000,
    dailyCaloriesTarget: user?.profile.dailyCaloriesTarget || 2200,
    dailyWaterTarget: user?.profile.dailyWaterTarget || 2.5,
    dailySleepTarget: user?.profile.dailySleepTarget || 8,
  });

  if (!user) return null;

  const earnedBadges = mockBadges.filter(b => b.earnedAt).slice(0, 6);

  const handleSave = () => {
    updateUser({
      name: form.name,
      profile: {
        ...user.profile,
        age: form.age,
        gender: form.gender as any,
        height: form.height,
        weight: form.weight,
        activityLevel: form.activityLevel as any,
        fitnessGoal: form.fitnessGoal as any,
        targetWeight: form.targetWeight,
        weeklyWorkoutTarget: form.weeklyWorkoutTarget,
        dailyStepsTarget: form.dailyStepsTarget,
        dailyCaloriesTarget: form.dailyCaloriesTarget,
        dailyWaterTarget: form.dailyWaterTarget,
        dailySleepTarget: form.dailySleepTarget,
      }
    });
    setEditing(false);
    addNotification('Profile updated successfully! ✅', 'success');
  };

  const bmi = (form.weight / ((form.height / 100) ** 2)).toFixed(1);
  const bmiStatus = +bmi < 18.5 ? 'Underweight' : +bmi < 25 ? 'Normal' : +bmi < 30 ? 'Overweight' : 'Obese';
  const bmiColor = +bmi < 18.5 ? 'text-blue-500' : +bmi < 25 ? 'text-green-500' : +bmi < 30 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative">
            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              className="w-24 h-24 rounded-2xl bg-gray-200 dark:bg-slate-700" alt={user.name} />
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            <p className="text-sm text-gray-400 mt-1">Member since {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
                Level {user.gamification.level}
              </span>
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold px-3 py-1 rounded-full">
                {user.gamification.xp.toLocaleString()} XP
              </span>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-semibold px-3 py-1 rounded-full">
                🔥 {user.stats.currentStreak} day streak
              </span>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)}
            className={editing ? 'btn-secondary' : 'btn-primary'}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Body Stats */}
      <div className="card p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Body Stats</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Age', value: form.age, unit: 'years' },
            { label: 'Height', value: form.height, unit: 'cm' },
            { label: 'Weight', value: form.weight, unit: 'kg' },
            { label: 'BMI', value: bmi, unit: bmiStatus, color: bmiColor },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color || 'text-gray-900 dark:text-white'}`}>{s.value}</p>
              <p className="text-xs text-gray-400">{s.unit}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          {form.weight > (form.targetWeight || form.weight) ? (
            <><TrendingDown className="w-4 h-4 text-green-500" /><span className="text-sm text-green-500">Goal: {form.targetWeight}kg ({(form.weight - (form.targetWeight || form.weight)).toFixed(1)}kg to lose)</span></>
          ) : (
            <><TrendingUp className="w-4 h-4 text-blue-500" /><span className="text-sm text-blue-500">Goal: {form.targetWeight}kg</span></>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="card p-6 border-2 border-green-200 dark:border-green-800">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5">Edit Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="label">Age</label>
              <input type="number" value={form.age} onChange={e => setForm(p => ({ ...p, age: +e.target.value }))} min="13" max="100" className="input" />
            </div>
            <div>
              <label className="label">Gender</label>
              <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value as any }))} className="input">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="label">Height (cm)</label>
              <input type="number" value={form.height} onChange={e => setForm(p => ({ ...p, height: +e.target.value }))} min="100" max="250" className="input" />
            </div>
            <div>
              <label className="label">Current Weight (kg)</label>
              <input type="number" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: +e.target.value }))} min="30" max="300" step="0.1" className="input" />
            </div>
            <div>
              <label className="label">Target Weight (kg)</label>
              <input type="number" value={form.targetWeight} onChange={e => setForm(p => ({ ...p, targetWeight: +e.target.value }))} min="30" max="300" step="0.1" className="input" />
            </div>
            <div>
              <label className="label">Activity Level</label>
              <select value={form.activityLevel} onChange={e => setForm(p => ({ ...p, activityLevel: e.target.value as any }))} className="input">
                <option value="sedentary">Sedentary (desk job, little exercise)</option>
                <option value="light">Light (1-3 days/week exercise)</option>
                <option value="moderate">Moderate (3-5 days/week exercise)</option>
                <option value="active">Active (6-7 days/week exercise)</option>
                <option value="very_active">Very Active (athlete/physical job)</option>
              </select>
            </div>
            <div>
              <label className="label">Fitness Goal</label>
              <select value={form.fitnessGoal} onChange={e => setForm(p => ({ ...p, fitnessGoal: e.target.value as any }))} className="input">
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="endurance">Endurance Improvement</option>
                <option value="general_fitness">General Fitness</option>
                <option value="flexibility">Flexibility & Mobility</option>
              </select>
            </div>
            <div>
              <label className="label">Weekly Workout Target</label>
              <input type="number" value={form.weeklyWorkoutTarget} onChange={e => setForm(p => ({ ...p, weeklyWorkoutTarget: +e.target.value }))} min="1" max="14" className="input" />
            </div>
            <div>
              <label className="label">Daily Steps Target</label>
              <input type="number" value={form.dailyStepsTarget} onChange={e => setForm(p => ({ ...p, dailyStepsTarget: +e.target.value }))} min="1000" max="50000" step="500" className="input" />
            </div>
            <div>
              <label className="label">Daily Calorie Target (kcal)</label>
              <input type="number" value={form.dailyCaloriesTarget} onChange={e => setForm(p => ({ ...p, dailyCaloriesTarget: +e.target.value }))} min="1000" max="5000" step="50" className="input" />
            </div>
            <div>
              <label className="label">Daily Water Target (liters)</label>
              <input type="number" value={form.dailyWaterTarget} onChange={e => setForm(p => ({ ...p, dailyWaterTarget: +e.target.value }))} min="1" max="6" step="0.25" className="input" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
            <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Recent Badges */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Badges</h3>
          <Award className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {earnedBadges.map(badge => (
            <div key={badge.id} className="flex flex-col items-center gap-1.5 group">
              <div className={`w-12 h-12 ${badge.color} rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110`}>
                {badge.icon}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-tight">{badge.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* All-time Stats */}
      <div className="card p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">All-Time Stats</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Workouts', value: user.stats.totalWorkouts, emoji: '🏋️' },
            { label: 'Calories Burned', value: `${(user.stats.totalCaloriesBurned / 1000).toFixed(1)}k kcal`, emoji: '🔥' },
            { label: 'Total Steps', value: `${(user.stats.totalSteps / 1000000).toFixed(2)}M`, emoji: '👟' },
            { label: 'Longest Streak', value: `${user.stats.longestStreak} days`, emoji: '⚡' },
            { label: 'Monthly Workouts', value: user.stats.monthlyWorkouts, emoji: '📅' },
            { label: 'Global Rank', value: `#${user.gamification.rank}`, emoji: '🏆' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3">
              <div className="text-xl mb-1">{s.emoji}</div>
              <p className="font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
