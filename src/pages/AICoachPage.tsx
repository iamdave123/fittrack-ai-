import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { aiMessages } from '../data/mockData';
import { AIMessage } from '../types';
import { Brain, Send, Sparkles, Dumbbell, Apple, TrendingUp, Heart, RefreshCw, Zap } from 'lucide-react';

const quickPrompts = [
  { icon: <Dumbbell className="w-4 h-4" />, text: 'Create a workout plan for weight loss', color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' },
  { icon: <Apple className="w-4 h-4" />, text: 'Suggest a high-protein meal plan', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800' },
  { icon: <TrendingUp className="w-4 h-4" />, text: 'Analyze my progress this week', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  { icon: <Heart className="w-4 h-4" />, text: 'Give me recovery tips', color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' },
  { icon: <Sparkles className="w-4 h-4" />, text: 'Motivate me to keep going!', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
  { icon: <Zap className="w-4 h-4" />, text: 'Best HIIT workout for beginners', color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' },
];

const aiResponses: Record<string, string> = {
  'workout plan': `🏋️ **Personalized Weight Loss Workout Plan**

Based on your profile (28M, 82kg, moderate activity, weight loss goal), here's your optimized 5-day plan:

**Monday — Upper Body Strength**
- Bench Press: 4×8-10 @ 70kg
- Pull-ups: 3×max
- Shoulder Press: 3×10-12
- Bicep Curls: 3×12-15
- Tricep Dips: 3×12

**Tuesday — HIIT Cardio (30 min)**
- 5 min warm-up
- 20 min: 40s work / 20s rest intervals
- 5 min cool-down
- 🔥 ~380 kcal burned

**Wednesday — Lower Body Strength**
- Squats: 4×8-10 @ 80kg
- Romanian Deadlifts: 3×10
- Leg Press: 3×12
- Calf Raises: 4×15
- Glute Bridges: 3×15

**Thursday — Active Recovery**
- 30 min yoga or light walking
- Foam rolling & stretching

**Friday — Full Body Circuit**
- 5 rounds: Burpees×10, Push-ups×15, Squats×20, Mountain Climbers×30s

**Weekend — Rest or Light Activity**

💡 **Key Tip:** Maintain a 300-500 calorie deficit daily. At your current rate, you'll reach your 75kg goal in approximately 10-12 weeks!`,

  'meal plan': `🥗 **High-Protein Meal Plan (2,200 kcal / 150g protein)**

**Breakfast (480 kcal | 35g protein)**
- 80g oats with 200ml almond milk
- 1 scoop whey protein
- 1 banana + handful of blueberries
- 1 tbsp almond butter

**Lunch (580 kcal | 48g protein)**
- 200g grilled chicken breast
- 150g quinoa (cooked)
- Mixed greens + cherry tomatoes
- Olive oil & lemon dressing

**Pre-Workout Snack (280 kcal | 20g protein)**
- 200g Greek yogurt (0% fat)
- 30g mixed nuts
- 1 apple

**Dinner (640 kcal | 45g protein)**
- 200g salmon fillet
- 200g sweet potato
- Steamed broccoli & asparagus
- Garlic butter sauce

**Evening Snack (220 kcal | 25g protein)**
- 200g cottage cheese
- 1 tbsp honey
- Cinnamon

🎯 **Macros:** 150g protein | 220g carbs | 65g fat
💧 **Hydration:** Aim for 2.5L water daily`,

  'progress': `📊 **Weekly Progress Analysis — Alex Johnson**

**This Week's Performance:**
✅ Workouts completed: 4/5 (80% — Great!)
✅ Avg daily steps: 8,420 (84% of goal)
⚠️ Avg water intake: 2.1L (84% of 2.5L goal)
✅ Avg sleep: 7.3 hours (91% of goal)
📉 Weight change: -0.4kg (on track!)

**Strengths:**
🔥 Excellent workout consistency — 12-day streak!
💪 Calorie deficit maintained all week
😴 Best sleep consistency in 3 weeks

**Areas to Improve:**
💧 Increase water intake — try drinking a glass before each meal
👟 Add 1,580 more steps daily to hit your 10k goal
🏋️ One more workout session would complete your weekly goal

**Projection:** At current rate, you'll reach 75kg in approximately **10 weeks** (around February 2026).

**AI Recommendation:** Your body is adapting well. Consider increasing workout intensity by 10% next week to avoid a plateau. 💪`,

  'recovery': `🌿 **Recovery & Regeneration Guide**

Based on your recent high-intensity training, here's your personalized recovery protocol:

**Immediate Post-Workout (0-30 min)**
- Consume 20-40g protein within 30 minutes
- Replenish with fast-absorbing carbs (banana, rice cakes)
- Hydrate with 500ml water + electrolytes

**Active Recovery Techniques**
🧘 **Yoga Flow (20 min):** Focus on hip flexors, hamstrings, and shoulders
🏊 **Light Swimming:** 20-30 min at 50% effort — excellent for muscle recovery
🚶 **Walking:** 30 min walk boosts blood flow without adding stress

**Sleep Optimization**
- Target 8 hours (you're averaging 7.3h — close!)
- Sleep at consistent times (10pm-6am optimal)
- Avoid screens 1 hour before bed
- Room temperature: 18-20°C for optimal sleep

**Nutrition for Recovery**
- Tart cherry juice: reduces muscle soreness by 20-30%
- Omega-3s (salmon, walnuts): anti-inflammatory
- Magnesium-rich foods: spinach, almonds, dark chocolate

**Signs You Need More Rest**
⚠️ Persistent muscle soreness beyond 72 hours
⚠️ Decreased performance in workouts
⚠️ Elevated resting heart rate
⚠️ Poor sleep quality

You're doing great — your 12-day streak shows excellent discipline! 🌟`,

  'motivat': `🚀 **You're Absolutely Crushing It, Alex!**

Let me tell you something — a **12-day streak** is no accident. That's 12 consecutive days of choosing yourself, your health, and your future. That's incredible.

**Look at what you've achieved:**
- 🏋️ 147 workouts completed
- 🔥 89,420 calories burned (that's like running 3+ marathons!)
- 👟 2.8 million steps taken
- 📉 Already making progress toward your 75kg goal

**Remember why you started.** Every rep, every step, every healthy meal is an investment in the best version of yourself.

**Today's Motivation:**
> "The body achieves what the mind believes. You're not just building muscle — you're building discipline, confidence, and resilience."

**Your next milestone:** Hit 150 workouts (just 3 away!) and earn the **"Century Club"** badge + 500 XP!

**One thing to do RIGHT NOW:** Drink a glass of water, put on your favorite playlist, and crush today's workout. You've got this! 💪🔥

I believe in you, Alex. Let's make today count! 🌟`,

  'hiit': `⚡ **Beginner HIIT Workout — 20 Minutes**

Perfect for burning fat and building cardiovascular fitness!

**Warm-Up (3 min)**
- March in place: 1 min
- Arm circles + leg swings: 1 min
- Light jogging in place: 1 min

**Main Circuit (14 min) — 4 rounds**
*40 seconds work / 20 seconds rest*

1. **Jumping Jacks** — Keep arms straight, land softly
2. **Modified Burpees** — Step out instead of jumping (beginner-friendly!)
3. **High Knees** — Drive knees to hip height, pump arms
4. **Squat Pulses** — Stay low, small bouncing movements
5. **Mountain Climbers** — Keep hips level, core tight
6. **Rest 60 seconds between rounds**

**Cool-Down (3 min)**
- Standing forward fold: 1 min
- Hip flexor stretch: 30s each side
- Child's pose: 1 min

**Expected Results:**
🔥 ~280-350 kcal burned
💓 Heart rate: 140-170 BPM
⏱️ Total time: 20 minutes

**Progression Plan:**
- Week 1-2: 2 rounds
- Week 3-4: 3 rounds
- Week 5+: Full 4 rounds

You'll see improvements in just 2 weeks! 🎯`,
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('workout') || lower.includes('exercise') || lower.includes('training')) return aiResponses['workout plan'];
  if (lower.includes('meal') || lower.includes('food') || lower.includes('nutrition') || lower.includes('protein')) return aiResponses['meal plan'];
  if (lower.includes('progress') || lower.includes('analyz') || lower.includes('week') || lower.includes('stats')) return aiResponses['progress'];
  if (lower.includes('recover') || lower.includes('rest') || lower.includes('sore')) return aiResponses['recovery'];
  if (lower.includes('motivat') || lower.includes('keep going') || lower.includes('inspire')) return aiResponses['motivat'];
  if (lower.includes('hiit') || lower.includes('interval') || lower.includes('beginner')) return aiResponses['hiit'];
  return `I'm here to help with your fitness journey! 💪

Based on your profile, here are some things I can help you with:

🏋️ **Workout Plans** — Personalized routines for your ${lower.includes('goal') ? 'goals' : 'weight loss goal'}
🥗 **Nutrition Advice** — Meal plans and macro tracking
📊 **Progress Analysis** — Weekly insights and trend analysis
💆 **Recovery Tips** — Optimize rest and prevent injury
🎯 **Goal Setting** — Realistic milestones and timelines
⚡ **Motivation** — When you need that extra push

What would you like to focus on today? Try asking me something specific!`;
}

export default function AICoachPage() {
  const { user } = useApp();
  const [messages, setMessages] = useState<AIMessage[]>(aiMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const aiMsg: AIMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getAIResponse(text),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      {/* Header */}
      <div className="card p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Brain className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-gray-900 dark:text-white">FitTrack AI Coach</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Online • Personalized for {user?.name.split(' ')[0]}</p>
          </div>
        </div>
        <button onClick={() => setMessages(aiMessages)}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {quickPrompts.map((p, i) => (
          <button key={i} onClick={() => sendMessage(p.text)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium whitespace-nowrap transition-all hover:scale-105 ${p.color}`}>
            {p.icon}
            {p.text}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 card p-4 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {msg.role === 'assistant' ? (
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
            ) : (
              <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex-shrink-0" alt="You" />
            )}
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'assistant'
                  ? 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                  : 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-tr-sm shadow-sm'
              }`}>
                {msg.content}
              </div>
              <span className="text-xs text-gray-400 px-1">
                {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="card p-3 flex gap-3 items-center">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask your AI coach anything..."
          className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
          disabled={isTyping}
        />
        <button type="submit" disabled={!input.trim() || isTyping}
          className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-sm hover:shadow-green-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
