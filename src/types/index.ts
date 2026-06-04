export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  profile: FitnessProfile;
  stats: UserStats;
  gamification: GamificationData;
}

export interface FitnessProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'general_fitness' | 'flexibility';
  targetWeight?: number;
  weeklyWorkoutTarget: number;
  dailyStepsTarget: number;
  dailyCaloriesTarget: number;
  dailyWaterTarget: number; // liters
  dailySleepTarget: number; // hours
}

export interface UserStats {
  totalWorkouts: number;
  totalCaloriesBurned: number;
  totalSteps: number;
  currentStreak: number;
  longestStreak: number;
  weeklyWorkouts: number;
  monthlyWorkouts: number;
}

export interface GamificationData {
  xp: number;
  level: number;
  badges: Badge[];
  completedChallenges: string[];
  rank: number;
}

export interface DailyActivity {
  id: string;
  date: string;
  steps: number;
  caloriesBurned: number;
  caloriesConsumed: number;
  waterIntake: number; // liters
  sleepHours: number;
  weight?: number;
  workouts: Workout[];
  mood: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface Workout {
  id: string;
  type: WorkoutType;
  name: string;
  duration: number; // minutes
  caloriesBurned: number;
  intensity: 'low' | 'medium' | 'high';
  exercises?: Exercise[];
  notes?: string;
  completedAt: string;
}

export type WorkoutType = 'cardio' | 'strength' | 'yoga' | 'hiit' | 'cycling' | 'swimming' | 'running' | 'walking' | 'sports' | 'other';

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number; // kg
  duration?: number; // seconds
  distance?: number; // km
}

export interface Meal {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber?: number;
  sugar?: number;
  servingSize?: string;
  time: string;
}

export interface NutritionDay {
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  waterIntake: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt?: string;
  category: 'workout' | 'nutrition' | 'streak' | 'milestone' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  target: number;
  current: number;
  unit: string;
  xpReward: number;
  completed: boolean;
  icon: string;
  color: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  weeklyWorkouts: number;
  isCurrentUser?: boolean;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'text' | 'workout_plan' | 'meal_plan' | 'tip' | 'motivation';
}

export interface WorkoutRecommendation {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: RecommendedExercise[];
  caloriesBurn: number;
  tags: string[];
  bestFor: string;
}

export interface RecommendedExercise {
  name: string;
  sets: number;
  reps?: string;
  duration?: string;
  rest: string;
  instructions: string;
  muscleGroups: string[];
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  totalWorkouts: number;
  totalCaloriesBurned: number;
  avgDailySteps: number;
  avgSleepHours: number;
  avgWaterIntake: number;
  weightChange: number;
  goalCompletion: number;
  highlights: string[];
  improvements: string[];
}

export interface WearableDevice {
  id: string;
  name: string;
  platform: 'google_fit' | 'samsung_health' | 'fitbit' | 'apple_health' | 'garmin' | 'polar';
  connected: boolean;
  lastSync?: string;
  icon: string;
  color: string;
}

export type Theme = 'light' | 'dark';
export type ActivePage = 'dashboard' | 'workouts' | 'nutrition' | 'coach' | 'analytics' | 'gamification' | 'wearables' | 'profile' | 'settings';
