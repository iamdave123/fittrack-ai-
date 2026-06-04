import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { nutritionTips } from '../data/mockData';
import { Meal } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Apple, Plus, Trash2, Droplets, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

const mealTypeConfig = {
  breakfast: { emoji: '🌅', label: 'Breakfast', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' },
  lunch: { emoji: '☀️', label: 'Lunch', color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
  dinner: { emoji: '🌙', label: 'Dinner', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
  snack: { emoji: '🍎', label: 'Snack', color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' },
};

const MACRO_COLORS = ['#22c55e', '#3b82f6', '#f59e0b'];

const weeklyNutrition = [
  { day: 'Mon', calories: 2100, protein: 140, carbs: 210, fat: 65 },
  { day: 'Tue', calories: 1950, protein: 155, carbs: 185, fat: 58 },
  { day: 'Wed', calories: 2280, protein: 148, carbs: 235, fat: 72 },
  { day: 'Thu', calories: 2050, protein: 162, carbs: 198, fat: 61 },
  { day: 'Fri', calories: 1880, protein: 145, carbs: 175, fat: 55 },
  { day: 'Sat', calories: 2350, protein: 138, carbs: 248, fat: 78 },
  { day: 'Sun', calories: 1920, protein: 146, carbs: 164, fat: 60 },
];

export default function NutritionPage() {
  const { meals, addMeal, removeMeal, user, todayActivity, updateTodayActivity, addNotification } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [form, setForm] = useState({
    mealType: 'breakfast' as Meal['mealType'],
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    servingSize: '',
    time: new Date().toTimeString().slice(0, 5),
  });

  const totalCalories = meals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = meals.reduce((s, m) => s + m.protein, 0);
  const totalCarbs = meals.reduce((s, m) => s + m.carbs, 0);
  const totalFat = meals.reduce((s, m) => s + m.fat, 0);

  const calorieGoal = user?.profile.dailyCaloriesTarget || 2200;
  const calorieBalance = calorieGoal - totalCalories;

  const macroData = [
    { name: 'Protein', value: totalProtein, grams: `${totalProtein}g`, color: '#22c55e' },
    { name: 'Carbs', value: totalCarbs, grams: `${totalCarbs}g`, color: '#3b82f6' },
    { name: 'Fat', value: totalFat, grams: `${totalFat}g`, color: '#f59e0b' },
  ];

  const handleAddMeal = () => {
    if (!form.name.trim()) { addNotification('Please enter a meal name', 'error'); return; }
    if (form.calories <= 0) { addNotification('Please enter calories', 'error'); return; }
    const newMeal: Meal = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...form,
    };
    addMeal(newMeal);
    setShowAddForm(false);
    setForm({ mealType: 'breakfast', name: '', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: '', time: new Date().toTimeString().slice(0, 5) });
  };

  const mealsByType = (type: Meal['mealType']) => meals.filter(m => m.mealType === type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nutrition Tracker</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Log Meal
        </button>
      </div>

      {/* Calorie Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Consumed', value: totalCalories, unit: 'kcal', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Burned', value: todayActivity.caloriesBurned, unit: 'kcal', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
          { label: 'Goal', value: calorieGoal, unit: 'kcal', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Balance', value: Math.abs(calorieBalance), unit: calorieBalance >= 0 ? 'kcal under' : 'kcal over', color: calorieBalance >= 0 ? 'text-green-500' : 'text-red-500', bg: calorieBalance >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20' },
        ].map((s, i) => (
          <div key={i} className={`card p-4 ${s.bg}`}>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400">{s.unit}</p>
          </div>
        ))}
      </div>

      {/* Macros & Water Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Macro Pie Chart */}
        <div className="card p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Macronutrient Breakdown</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={macroData} cx={55} cy={55} innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                  {macroData.map((_, i) => <Cell key={i} fill={MACRO_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: any, n: any) => [`${v}g`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {macroData.map((m, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{m.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{m.grams}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Calorie breakdown</p>
            <div className="flex justify-around mt-2">
              <div className="text-center">
                <p className="text-sm font-bold text-green-500">{Math.round((totalProtein * 4 / totalCalories) * 100) || 0}%</p>
                <p className="text-xs text-gray-400">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-blue-500">{Math.round((totalCarbs * 4 / totalCalories) * 100) || 0}%</p>
                <p className="text-xs text-gray-400">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-yellow-500">{Math.round((totalFat * 9 / totalCalories) * 100) || 0}%</p>
                <p className="text-xs text-gray-400">Fat</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Calories Chart */}
        <div className="card p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Weekly Calories</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyNutrition} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="calories" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Water & AI Tip */}
        <div className="space-y-4">
          {/* Water Tracker */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 dark:text-white">Water Intake</h3>
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-bold text-blue-500">{todayActivity.waterIntake}L</span>
              <span className="text-gray-400 text-sm mb-1">/ {user?.profile.dailyWaterTarget}L goal</span>
            </div>
            <div className="progress-bar mb-3">
              <div className="progress-fill bg-blue-500" style={{ width: `${Math.min((todayActivity.waterIntake / (user?.profile.dailyWaterTarget || 2.5)) * 100, 100)}%` }} />
            </div>
            <div className="flex gap-2">
              {[0.25, 0.5, 1].map(amount => (
                <button key={amount} onClick={() => {
                  updateTodayActivity({ waterIntake: Math.min(todayActivity.waterIntake + amount, 5) });
                  addNotification(`+${amount}L water logged! 💧`, 'success');
                }} className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  +{amount}L
                </button>
              ))}
            </div>
          </div>

          {/* AI Nutrition Tip */}
          <div className="card p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-green-500" />
              <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide">AI Nutrition Tip</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{nutritionTips[tipIndex]}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-1">
                {nutritionTips.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === tipIndex ? 'bg-green-500' : 'bg-gray-200 dark:bg-slate-600'}`} />
                ))}
              </div>
              <div className="flex gap-1">
                <button onClick={() => setTipIndex(p => (p - 1 + nutritionTips.length) % nutritionTips.length)}
                  className="p-1 text-gray-400 hover:text-green-500 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setTipIndex(p => (p + 1) % nutritionTips.length)}
                  className="p-1 text-gray-400 hover:text-green-500 transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Meal Form */}
      {showAddForm && (
        <div className="card p-6 border-2 border-green-200 dark:border-green-800">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Log New Meal</h3>
          <div className="flex gap-2 mb-4">
            {(Object.keys(mealTypeConfig) as Meal['mealType'][]).map(type => (
              <button key={type} onClick={() => setForm(p => ({ ...p, mealType: type }))}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                  form.mealType === type ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                  'border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400'
                }`}>
                <span>{mealTypeConfig[type].emoji}</span>
                <span className="hidden sm:inline">{mealTypeConfig[type].label}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="label">Meal Name</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Grilled Chicken Salad" className="input" />
            </div>
            <div>
              <label className="label">Calories (kcal)</label>
              <input type="number" value={form.calories || ''} onChange={e => setForm(p => ({ ...p, calories: +e.target.value }))} min="0" className="input" />
            </div>
            <div>
              <label className="label">Protein (g)</label>
              <input type="number" value={form.protein || ''} onChange={e => setForm(p => ({ ...p, protein: +e.target.value }))} min="0" className="input" />
            </div>
            <div>
              <label className="label">Carbohydrates (g)</label>
              <input type="number" value={form.carbs || ''} onChange={e => setForm(p => ({ ...p, carbs: +e.target.value }))} min="0" className="input" />
            </div>
            <div>
              <label className="label">Fat (g)</label>
              <input type="number" value={form.fat || ''} onChange={e => setForm(p => ({ ...p, fat: +e.target.value }))} min="0" className="input" />
            </div>
            <div>
              <label className="label">Serving Size</label>
              <input type="text" value={form.servingSize} onChange={e => setForm(p => ({ ...p, servingSize: e.target.value }))}
                placeholder="e.g. 1 bowl, 200g" className="input" />
            </div>
            <div>
              <label className="label">Time</label>
              <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="input" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAddMeal} className="btn-primary flex items-center gap-2">
              <Apple className="w-4 h-4" /> Save Meal
            </button>
            <button onClick={() => setShowAddForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Meals by Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.keys(mealTypeConfig) as Meal['mealType'][]).map(type => {
          const typeMeals = mealsByType(type);
          const typeCalories = typeMeals.reduce((s, m) => s + m.calories, 0);
          const config = mealTypeConfig[type];
          return (
            <div key={type} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{config.emoji}</span>
                  <h4 className="font-bold text-gray-900 dark:text-white">{config.label}</h4>
                </div>
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{typeCalories} kcal</span>
              </div>
              {typeMeals.length > 0 ? (
                <div className="space-y-2">
                  {typeMeals.map(meal => (
                    <div key={meal.id} className="flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 rounded-xl px-3 py-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{meal.name}</p>
                        <div className="flex gap-2 text-xs text-gray-400 mt-0.5">
                          <span>{meal.calories} kcal</span>
                          <span>P: {meal.protein}g</span>
                          <span>C: {meal.carbs}g</span>
                          <span>F: {meal.fat}g</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-xs text-gray-400">{meal.time}</span>
                        <button onClick={() => removeMeal(meal.id)}
                          className="text-gray-300 dark:text-slate-600 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400 dark:text-gray-500">No {config.label.toLowerCase()} logged</p>
                  <button onClick={() => { setForm(p => ({ ...p, mealType: type })); setShowAddForm(true); }}
                    className="text-xs text-green-500 hover:text-green-600 mt-1 font-medium">+ Add meal</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
