import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Eye, EyeOff, Zap, TrendingUp, Award, Heart } from 'lucide-react';

export default function AuthPage() {
  const { login, register } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: 'alex@fittrack.ai', password: 'password123' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return; }
        await register(form.name, form.email, form.password);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const features = [
    { icon: <Activity className="w-5 h-5" />, text: 'Track daily activity & workouts', color: 'text-green-400' },
    { icon: <Zap className="w-5 h-5" />, text: 'AI-powered fitness coaching', color: 'text-yellow-400' },
    { icon: <TrendingUp className="w-5 h-5" />, text: 'Advanced progress analytics', color: 'text-blue-400' },
    { icon: <Award className="w-5 h-5" />, text: 'Gamification & achievements', color: 'text-purple-400' },
    { icon: <Heart className="w-5 h-5" />, text: 'Nutrition & meal planning', color: 'text-red-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-900 via-slate-900 to-purple-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">FitTrack AI</h1>
              <p className="text-green-400 text-sm font-medium">Your AI Fitness Coach</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Transform Your<br />
            <span className="bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
              Fitness Journey
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            AI-powered tracking, personalized coaching, and gamified challenges to keep you motivated every day.
          </p>

          <div className="space-y-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 backdrop-blur-sm">
                <span className={f.color}>{f.icon}</span>
                <span className="text-slate-300 font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex -space-x-2">
              {['Alex', 'Sarah', 'Marcus', 'Emma'].map(n => (
                <img key={n} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${n}`}
                  className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700" alt={n} />
              ))}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">50,000+ active users</p>
              <p className="text-slate-400 text-xs">Join the fitness revolution</p>
            </div>
            <div className="ml-auto text-yellow-400 text-sm font-bold">⭐ 4.9</div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">FitTrack AI</h1>
          </div>

          <div className="bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-1">
                {mode === 'login' ? 'Welcome back!' : 'Create account'}
              </h2>
              <p className="text-slate-400">
                {mode === 'login' ? 'Sign in to continue your fitness journey' : 'Start your transformation today'}
              </p>
            </div>

            {/* Tab Toggle */}
            <div className="flex bg-slate-700/50 rounded-xl p-1 mb-6">
              {(['login', 'register'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    mode === m ? 'bg-green-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}>
                  {m === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="label text-slate-300">Full Name</label>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Alex Johnson" className="input bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-green-500" required />
                </div>
              )}
              <div>
                <label className="label text-slate-300">Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="alex@example.com" className="input bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-green-500" required />
              </div>
              <div>
                <label className="label text-slate-300">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="••••••••" className="input bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-green-500 pr-12" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              {mode === 'login' && (
                <div className="text-right">
                  <button type="button" className="text-green-400 text-sm hover:text-green-300 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>

              {mode === 'login' && (
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-xs text-slate-500 bg-slate-800 px-2">
                    or try demo
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <button type="button"
                  onClick={() => { setForm({ name: '', email: 'alex@fittrack.ai', password: 'password123' }); }}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-3 rounded-xl transition-all duration-200 text-sm">
                  Use Demo Account
                </button>
              )}
            </form>

            <p className="text-center text-slate-500 text-sm mt-6">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-green-400 hover:text-green-300 font-semibold transition-colors">
                {mode === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
