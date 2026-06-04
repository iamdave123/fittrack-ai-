import { User, DailyActivity, Meal, Badge, Challenge, LeaderboardEntry, WorkoutRecommendation, WearableDevice, WeeklyReport } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@fittrack.ai',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  joinDate: '2024-01-15',
  profile: {
    age: 28,
    gender: 'male',
    height: 178,
    weight: 82,
    activityLevel: 'moderate',
    fitnessGoal: 'weight_loss',
    targetWeight: 75,
    weeklyWorkoutTarget: 5,
    dailyStepsTarget: 10000,
    dailyCaloriesTarget: 2200,
    dailyWaterTarget: 2.5,
    dailySleepTarget: 8,
  },
  stats: {
    totalWorkouts: 147,
    totalCaloriesBurned: 89420,
    totalSteps: 2847300,
    currentStreak: 12,
    longestStreak: 28,
    weeklyWorkouts: 4,
    monthlyWorkouts: 18,
  },
  gamification: {
    xp: 8750,
    level: 14,
    badges: [],
    completedChallenges: ['ch1', 'ch2', 'ch5'],
    rank: 23,
  },
};

export const generateWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    day,
    steps: Math.floor(6000 + Math.random() * 6000),
    calories: Math.floor(1800 + Math.random() * 800),
    water: parseFloat((1.5 + Math.random() * 1.5).toFixed(1)),
    sleep: parseFloat((6 + Math.random() * 3).toFixed(1)),
    workoutMinutes: i === 1 || i === 4 ? 0 : Math.floor(30 + Math.random() * 60),
    weight: parseFloat((82 - i * 0.1 + Math.random() * 0.3).toFixed(1)),
  }));
};

export const generateMonthlyData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    date: new Date(2025, 11, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: parseFloat((84 - i * 0.07 + (Math.random() - 0.5) * 0.4).toFixed(1)),
    calories: Math.floor(1900 + Math.random() * 600),
    steps: Math.floor(5000 + Math.random() * 7000),
    workouts: Math.random() > 0.35 ? 1 : 0,
  }));
};

export const generateYearlyData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => ({
    month,
    workouts: Math.floor(12 + Math.random() * 10),
    avgCalories: Math.floor(2000 + Math.random() * 400),
    avgSteps: Math.floor(7000 + Math.random() * 4000),
    avgWeight: parseFloat((86 - i * 0.3 + (Math.random() - 0.5) * 0.5).toFixed(1)),
  }));
};

export const todayActivity: DailyActivity = {
  id: 'today',
  date: new Date().toISOString().split('T')[0],
  steps: 7842,
  caloriesBurned: 1650,
  caloriesConsumed: 1920,
  waterIntake: 1.8,
  sleepHours: 7.5,
  weight: 82.1,
  workouts: [
    {
      id: 'w1',
      type: 'strength',
      name: 'Upper Body Strength',
      duration: 45,
      caloriesBurned: 320,
      intensity: 'high',
      completedAt: new Date().toISOString(),
      exercises: [
        { name: 'Bench Press', sets: 4, reps: 10, weight: 70 },
        { name: 'Pull-ups', sets: 3, reps: 8, weight: 0 },
        { name: 'Shoulder Press', sets: 3, reps: 10, weight: 30 },
        { name: 'Tricep Dips', sets: 3, reps: 12, weight: 0 },
      ],
    },
  ],
  mood: 4,
};

export const mockMeals: Meal[] = [
  {
    id: 'm1',
    date: new Date().toISOString().split('T')[0],
    mealType: 'breakfast',
    name: 'Oatmeal with Berries & Protein Shake',
    calories: 480,
    protein: 35,
    carbs: 62,
    fat: 8,
    fiber: 8,
    sugar: 18,
    servingSize: '1 bowl + 1 shake',
    time: '07:30',
  },
  {
    id: 'm2',
    date: new Date().toISOString().split('T')[0],
    mealType: 'lunch',
    name: 'Grilled Chicken Salad',
    calories: 520,
    protein: 45,
    carbs: 28,
    fat: 22,
    fiber: 6,
    sugar: 8,
    servingSize: 'Large bowl',
    time: '12:30',
  },
  {
    id: 'm3',
    date: new Date().toISOString().split('T')[0],
    mealType: 'snack',
    name: 'Greek Yogurt & Almonds',
    calories: 280,
    protein: 18,
    carbs: 22,
    fat: 12,
    time: '15:30',
  },
  {
    id: 'm4',
    date: new Date().toISOString().split('T')[0],
    mealType: 'dinner',
    name: 'Salmon with Quinoa & Vegetables',
    calories: 640,
    protein: 48,
    carbs: 52,
    fat: 18,
    fiber: 7,
    time: '19:00',
  },
];

export const mockBadges: Badge[] = [
  { id: 'b1', name: 'First Step', description: 'Complete your first workout', icon: '👟', color: 'bg-blue-100 text-blue-600', earnedAt: '2024-01-15', category: 'workout', rarity: 'common' },
  { id: 'b2', name: 'Week Warrior', description: '7-day workout streak', icon: '🔥', color: 'bg-orange-100 text-orange-600', earnedAt: '2024-01-22', category: 'streak', rarity: 'common' },
  { id: 'b3', name: 'Hydration Hero', description: 'Hit water goal 10 days in a row', icon: '💧', color: 'bg-cyan-100 text-cyan-600', earnedAt: '2024-02-01', category: 'nutrition', rarity: 'rare' },
  { id: 'b4', name: 'Iron Will', description: 'Complete 50 strength workouts', icon: '💪', color: 'bg-gray-100 text-gray-600', earnedAt: '2024-03-15', category: 'workout', rarity: 'rare' },
  { id: 'b5', name: 'Marathon Mind', description: 'Run 100km total', icon: '🏃', color: 'bg-green-100 text-green-600', earnedAt: '2024-04-20', category: 'milestone', rarity: 'epic' },
  { id: 'b6', name: 'Nutrition Ninja', description: 'Log meals for 30 consecutive days', icon: '🥗', color: 'bg-emerald-100 text-emerald-600', earnedAt: '2024-05-10', category: 'nutrition', rarity: 'rare' },
  { id: 'b7', name: 'Sleep Champion', description: 'Hit sleep goal 14 days in a row', icon: '😴', color: 'bg-purple-100 text-purple-600', earnedAt: '2024-05-25', category: 'milestone', rarity: 'rare' },
  { id: 'b8', name: 'Century Club', description: 'Complete 100 workouts', icon: '🏆', color: 'bg-yellow-100 text-yellow-600', earnedAt: '2024-06-01', category: 'milestone', rarity: 'epic' },
  { id: 'b9', name: 'Legend', description: 'Reach Level 20', icon: '⭐', color: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700', category: 'milestone', rarity: 'legendary' },
  { id: 'b10', name: 'Social Butterfly', description: 'Join 5 group challenges', icon: '🦋', color: 'bg-pink-100 text-pink-600', category: 'social', rarity: 'common' },
  { id: 'b11', name: 'Early Bird', description: 'Complete 20 morning workouts', icon: '🌅', color: 'bg-amber-100 text-amber-600', category: 'workout', rarity: 'rare' },
  { id: 'b12', name: 'Consistency King', description: '28-day streak', icon: '👑', color: 'bg-violet-100 text-violet-600', earnedAt: '2024-07-01', category: 'streak', rarity: 'legendary' },
];

export const mockChallenges: Challenge[] = [
  { id: 'ch1', title: '10K Steps', description: 'Walk 10,000 steps today', type: 'daily', target: 10000, current: 7842, unit: 'steps', xpReward: 50, completed: false, icon: '👟', color: 'bg-blue-500' },
  { id: 'ch2', title: 'Hydration Goal', description: 'Drink 2.5L of water today', type: 'daily', target: 2.5, current: 1.8, unit: 'liters', xpReward: 30, completed: false, icon: '💧', color: 'bg-cyan-500' },
  { id: 'ch3', title: 'Calorie Burn', description: 'Burn 500 calories through exercise', type: 'daily', target: 500, current: 320, unit: 'calories', xpReward: 60, completed: false, icon: '🔥', color: 'bg-orange-500' },
  { id: 'ch4', title: 'Sleep 8 Hours', description: 'Get 8 hours of quality sleep', type: 'daily', target: 8, current: 7.5, unit: 'hours', xpReward: 40, completed: false, icon: '😴', color: 'bg-purple-500' },
  { id: 'ch5', title: 'Weekly Warrior', description: 'Complete 5 workouts this week', type: 'weekly', target: 5, current: 4, unit: 'workouts', xpReward: 200, completed: false, icon: '⚡', color: 'bg-yellow-500' },
  { id: 'ch6', title: 'Protein Power', description: 'Hit 150g protein goal today', type: 'daily', target: 150, current: 146, unit: 'grams', xpReward: 45, completed: false, icon: '🥩', color: 'bg-red-500' },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: 'u1', name: 'Sarah Chen', xp: 15420, level: 22, weeklyWorkouts: 7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { rank: 2, userId: 'u2', name: 'Marcus Williams', xp: 13890, level: 20, weeklyWorkouts: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
  { rank: 3, userId: 'u3', name: 'Emma Rodriguez', xp: 12340, level: 19, weeklyWorkouts: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
  { rank: 4, userId: 'u4', name: 'James Kim', xp: 11200, level: 18, weeklyWorkouts: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
  { rank: 5, userId: 'u5', name: 'Priya Patel', xp: 10650, level: 17, weeklyWorkouts: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
  { rank: 6, userId: 'u6', name: 'Tom Anderson', xp: 9800, level: 16, weeklyWorkouts: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom' },
  { rank: 7, userId: 'u7', name: 'Lisa Park', xp: 9200, level: 15, weeklyWorkouts: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa' },
  { rank: 8, userId: 'u8', name: 'David Brown', xp: 8900, level: 15, weeklyWorkouts: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  { rank: 23, userId: '1', name: 'Alex Johnson', xp: 8750, level: 14, weeklyWorkouts: 4, isCurrentUser: true, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
];

export const workoutRecommendations: WorkoutRecommendation[] = [
  {
    id: 'wr1',
    title: 'HIIT Fat Burner',
    description: 'High-intensity interval training designed to maximize calorie burn and boost metabolism for 24+ hours.',
    duration: 30,
    difficulty: 'intermediate',
    caloriesBurn: 380,
    tags: ['cardio', 'fat loss', 'no equipment'],
    bestFor: 'Weight loss & cardiovascular fitness',
    exercises: [
      { name: 'Jumping Jacks', sets: 3, reps: '45 sec', rest: '15 sec', instructions: 'Keep arms straight and jump feet wide', muscleGroups: ['full body'] },
      { name: 'Burpees', sets: 3, reps: '30 sec', rest: '30 sec', instructions: 'Full body movement, chest to floor', muscleGroups: ['full body', 'core'] },
      { name: 'Mountain Climbers', sets: 3, reps: '40 sec', rest: '20 sec', instructions: 'Keep hips level, drive knees to chest', muscleGroups: ['core', 'shoulders'] },
      { name: 'High Knees', sets: 3, reps: '45 sec', rest: '15 sec', instructions: 'Drive knees above hip height', muscleGroups: ['legs', 'core'] },
      { name: 'Jump Squats', sets: 3, reps: '30 sec', rest: '30 sec', instructions: 'Land softly, absorb impact through hips', muscleGroups: ['quads', 'glutes'] },
    ],
  },
  {
    id: 'wr2',
    title: 'Upper Body Strength',
    description: 'Compound and isolation exercises targeting chest, back, shoulders, and arms for muscle growth.',
    duration: 50,
    difficulty: 'intermediate',
    caloriesBurn: 290,
    tags: ['strength', 'muscle gain', 'gym'],
    bestFor: 'Muscle building & strength',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90 sec', instructions: 'Control the descent, full range of motion', muscleGroups: ['chest', 'triceps', 'shoulders'] },
      { name: 'Bent-over Rows', sets: 4, reps: '8-10', rest: '90 sec', instructions: 'Keep back flat, pull to lower chest', muscleGroups: ['back', 'biceps'] },
      { name: 'Overhead Press', sets: 3, reps: '10-12', rest: '75 sec', instructions: 'Press directly overhead, engage core', muscleGroups: ['shoulders', 'triceps'] },
      { name: 'Pull-ups', sets: 3, reps: 'max', rest: '90 sec', instructions: 'Full hang to chin over bar', muscleGroups: ['back', 'biceps'] },
      { name: 'Bicep Curls', sets: 3, reps: '12-15', rest: '60 sec', instructions: 'Control the eccentric phase', muscleGroups: ['biceps'] },
    ],
  },
  {
    id: 'wr3',
    title: 'Morning Yoga Flow',
    description: 'Gentle yet effective yoga sequence to improve flexibility, reduce stress, and energize your morning.',
    duration: 25,
    difficulty: 'beginner',
    caloriesBurn: 120,
    tags: ['yoga', 'flexibility', 'stress relief'],
    bestFor: 'Flexibility & mental wellness',
    exercises: [
      { name: 'Sun Salutation A', sets: 3, duration: '3 min', rest: '30 sec', instructions: 'Flow through each pose with breath', muscleGroups: ['full body'] },
      { name: 'Warrior I & II', sets: 2, duration: '2 min each side', rest: '30 sec', instructions: 'Hold each pose for 5 breaths', muscleGroups: ['legs', 'hips', 'core'] },
      { name: 'Downward Dog', sets: 3, duration: '1 min', rest: '20 sec', instructions: 'Press heels toward floor, lengthen spine', muscleGroups: ['hamstrings', 'shoulders', 'calves'] },
      { name: "Child's Pose", sets: 2, duration: '2 min', rest: '0 sec', instructions: 'Breathe deeply, relax completely', muscleGroups: ['back', 'hips'] },
    ],
  },
];

export const mockWearables: WearableDevice[] = [
  { id: 'w1', name: 'Google Fit', platform: 'google_fit', connected: false, icon: '🏃', color: 'bg-blue-500' },
  { id: 'w2', name: 'Samsung Health', platform: 'samsung_health', connected: false, icon: '💙', color: 'bg-blue-600' },
  { id: 'w3', name: 'Fitbit', platform: 'fitbit', connected: true, lastSync: '2025-12-01T10:30:00', icon: '⌚', color: 'bg-teal-500' },
  { id: 'w4', name: 'Apple Health', platform: 'apple_health', connected: false, icon: '🍎', color: 'bg-gray-800' },
  { id: 'w5', name: 'Garmin Connect', platform: 'garmin', connected: false, icon: '🗺️', color: 'bg-green-600' },
  { id: 'w6', name: 'Polar Flow', platform: 'polar', connected: false, icon: '❄️', color: 'bg-red-500' },
];

export const weeklyReport: WeeklyReport = {
  weekStart: '2025-11-25',
  weekEnd: '2025-12-01',
  totalWorkouts: 4,
  totalCaloriesBurned: 2840,
  avgDailySteps: 8420,
  avgSleepHours: 7.3,
  avgWaterIntake: 2.1,
  weightChange: -0.4,
  goalCompletion: 78,
  highlights: [
    'Achieved 4 out of 5 workout goal',
    'Maintained calorie deficit all week',
    'Best sleep consistency in 3 weeks',
    'New personal best in bench press',
  ],
  improvements: [
    'Increase daily water intake by 0.4L',
    'Add one more workout session',
    'Improve step count on rest days',
  ],
};

export const aiMessages = [
  {
    id: 'ai1',
    role: 'assistant' as const,
    content: "Hey Alex! 👋 I'm your AI fitness coach. I've analyzed your recent activity and I'm here to help you crush your weight loss goals. You're doing great — 12-day streak! What would you like to work on today?",
    timestamp: new Date(Date.now() - 60000).toISOString(),
    type: 'text' as const,
  },
];

export const nutritionTips = [
  "🥗 Based on your weight loss goal, aim for a 300-500 calorie deficit daily. You're currently at -280 calories — perfect range!",
  "💪 Your protein intake is excellent at 146g today. This will help preserve muscle mass during your cut.",
  "🌊 You're at 1.8L water today. Try to reach your 2.5L goal — hydration boosts metabolism by up to 30%.",
  "⏰ Consider eating your largest meal 2-3 hours before your workout for optimal energy and performance.",
  "🍎 Your fiber intake is good. High fiber foods keep you fuller longer, supporting your calorie deficit.",
];

export const fitnessInsights = [
  { label: 'BMI', value: '25.9', status: 'Overweight', color: 'text-yellow-500', trend: 'improving' },
  { label: 'Body Fat Est.', value: '18.2%', status: 'Fitness', color: 'text-green-500', trend: 'stable' },
  { label: 'TDEE', value: '2,847 kcal', status: 'Maintenance', color: 'text-blue-500', trend: 'stable' },
  { label: 'VO2 Max Est.', value: '42.3', status: 'Good', color: 'text-green-500', trend: 'improving' },
];
