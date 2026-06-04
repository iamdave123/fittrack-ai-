import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { workoutRecommendations } from '../data/mockData';
import { Dumbbell, Play, Clock, Flame, ChevronDown, ChevronUp, Plus, Check, Star } from 'lucide-react';
import { WorkoutType, Workout } from '../types';

const workoutTypes: { type: WorkoutType; emoji: string; label: string }[] = [
  { type: 'strength', emoji: '💪', label: 'Strength' },
  { type: 'cardio', emoji: '🏃', label: 'Cardio' },
  { type: 'hiit', emoji: '⚡', label: 'HIIT' },
  { type: 'yoga', emoji: '🧘', label: 'Yoga' },
  { type: 'cycling', emoji: '🚴', label: 'Cycling' },
  { type: 'swimming', emoji: '🏊', label: 'Swimming' },
  { type: 'running', emoji: '👟', label: 'Running' },
  { type: 'walking', emoji: '🚶', label: 'Walking' },
];

export default function WorkoutsPage() {
  const { todayActivity, updateTodayActivity, addNotification, user } = useApp();
  const [expandedRec, setExpandedRec] = useState<string | null>(null);
  const [showLogForm, setShowLogForm] = useState(false);
  const [logForm, setLogForm] = useState({
    type: 'strength' as WorkoutType,
    name: '',
    duration: 45,
    caloriesBurned: 300,
    intensity: 'medium' as 'low' | 'medium' | 'high',
    notes: '',
  });

  const handleLogWorkout = () => {
    if (!logForm.name.trim()) { addNotification('Please enter a workout name', 'error'); return; }
    const newWorkout: Workout = {
      id: Date.now().toString(),
      ...logForm,
      completedAt: new Date().toISOString(),
    };
    updateTodayActivity({ workouts: [...todayActivity.workouts, newWorkout] });
    addNotification(`Workout "${logForm.name}" logged! 💪 +${logForm.caloriesBurned} calories burned`, 'success');
    setShowLogForm(false);
    setLogForm({ type: 'strength', name: '', duration: 45, caloriesBurned: 300, intensity: 'medium', notes: '' });
  };

  const difficultyColor = (d: string) => ({
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }[d] || '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Workouts</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {todayActivity.workouts.length} workout{todayActivity.workouts.length !== 1 ? 's' : ''} logged today •
            {' '}{user?.stats.weeklyWorkouts}/{user?.profile.weeklyWorkoutTarget} this week
          </p>
        </div>
        <button onClick={() => setShowLogForm(!showLogForm)}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Log Workout
        </button>
      </div>

      {/* Log Workout Form */}
      {showLogForm && (
        <div className="card p-6 border-2 border-green-200 dark:border-green-800">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Log New Workout</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {workoutTypes.map(wt => (
              <button key={wt.type} onClick={() => setLogForm(p => ({ ...p, type: wt.type }))}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                  logForm.type === wt.type ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                  'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                }`}>
                <span className="text-xl">{wt.emoji}</span>
                <span>{wt.label}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Workout Name</label>
              <input type="text" value={logForm.name} onChange={e => setLogForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Morning Run, Chest Day..." className="input" />
            </div>
            <div>
              <label className="label">Duration (minutes)</label>
              <input type="number" value={logForm.duration} onChange={e => setLogForm(p => ({ ...p, duration: +e.target.value }))}
                min="5" max="300" className="input" />
            </div>
            <div>
              <label className="label">Calories Burned</label>
              <input type="number" value={logForm.caloriesBurned} onChange={e => setLogForm(p => ({ ...p, caloriesBurned: +e.target.value }))}
                min="50" max="2000" className="input" />
            </div>
            <div>
              <label className="label">Intensity</label>
              <select value={logForm.intensity} onChange={e => setLogForm(p => ({ ...p, intensity: e.target.value as any }))} className="input">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="label">Notes (optional)</label>
            <textarea value={logForm.notes} onChange={e => setLogForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="How did it feel? Any personal records?" rows={2} className="input resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleLogWorkout} className="btn-primary flex items-center gap-2">
              <Check className="w-4 h-4" /> Save Workout
            </button>
            <button onClick={() => setShowLogForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Today's Workouts */}
      {todayActivity.workouts.length > 0 && (
        <div className="card p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Today's Completed Workouts</h3>
          <div className="space-y-3">
            {todayActivity.workouts.map(w => (
              <div key={w.id} className="flex items-center gap-4 bg-green-50 dark:bg-green-900/10 rounded-xl p-4 border border-green-100 dark:border-green-900/30">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-xl">
                  {workoutTypes.find(t => t.type === w.type)?.emoji || '💪'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{w.name}</p>
                  <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{w.duration} min</span>
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3" />{w.caloriesBurned} kcal</span>
                    <span className="capitalize">{w.intensity} intensity</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <Check className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="font-bold text-gray-900 dark:text-white">AI Recommended Workouts</h3>
          <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">AI</span>
        </div>
        <div className="space-y-4">
          {workoutRecommendations.map(rec => (
            <div key={rec.id} className="card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-white">{rec.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${difficultyColor(rec.difficulty)}`}>
                        {rec.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{rec.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 text-blue-500" />{rec.duration} min
                      </span>
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Flame className="w-4 h-4 text-orange-500" />~{rec.caloriesBurn} kcal
                      </span>
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Dumbbell className="w-4 h-4 text-purple-500" />{rec.exercises.length} exercises
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {rec.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => {
                      setLogForm({ type: 'strength', name: rec.title, duration: rec.duration, caloriesBurned: rec.caloriesBurn, intensity: 'medium', notes: '' });
                      setShowLogForm(true);
                      addNotification(`"${rec.title}" loaded — customize and save!`, 'info');
                    }} className="btn-primary flex items-center gap-1.5 text-sm py-2 px-3">
                      <Play className="w-4 h-4" /> Start
                    </button>
                    <button onClick={() => setExpandedRec(expandedRec === rec.id ? null : rec.id)}
                      className="btn-secondary flex items-center gap-1.5 text-sm py-2 px-3">
                      {expandedRec === rec.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      Details
                    </button>
                  </div>
                </div>
              </div>

              {expandedRec === rec.id && (
                <div className="border-t border-gray-100 dark:border-slate-700 p-5 bg-gray-50 dark:bg-slate-700/30">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Exercise Plan</h5>
                  <div className="space-y-3">
                    {rec.exercises.map((ex, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white dark:bg-slate-800 rounded-xl p-3">
                        <div className="w-7 h-7 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{ex.name}</p>
                            <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
                              {ex.sets && <span>{ex.sets} sets</span>}
                              {ex.reps && <span>× {ex.reps}</span>}
                              {ex.duration && <span>{ex.duration}</span>}
                              <span className="text-gray-400">• Rest: {ex.rest}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ex.instructions}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {ex.muscleGroups.map(mg => (
                              <span key={mg} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs px-1.5 py-0.5 rounded capitalize">{mg}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
                    💡 Best for: {rec.bestFor}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
