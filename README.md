# FitTrack AI 💪

A modern, AI-powered fitness tracking application built with React, Vite, and TailwindCSS.



## Features

- **Dashboard** — Daily goals, activity charts, macros, fitness insights, streaks
- **AI Fitness Coach** — Conversational AI with personalized workout plans, nutrition advice, recovery tips
- **Nutrition Tracker** — Meal logging, macro breakdown, water intake, weekly calorie trends
- **Workout Logging** — Log workouts, AI-recommended sessions, exercise details
- **Analytics** — Weekly/monthly/yearly reports with interactive charts
- **Gamification** — XP levels, achievement badges, daily challenges, global leaderboard
- **Wearable Devices** — Google Fit, Samsung Health, Fitbit, Apple Health, Garmin, Polar
- **Dark/Light Mode** — Full theme support with smooth transitions
- **Mobile-First** — Fully responsive design

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 8 |
| Styling | TailwindCSS 3 |
| Charts | Recharts 2 |
| Icons | Lucide React |
| State | React Context API |
| AI | OpenAI GPT-4 |



```

## Project Structure

```
src/
├── components/layout/   # Layout, Sidebar, TopBar
├── context/             # AppContext (auth, theme, state)
├── data/                # Mock data, AI responses, chart data
├── pages/               # All 9 application pages
├── types/               # TypeScript interfaces
├── App.tsx              # Root + routing
└── index.css            # Global styles + Tailwind
```

## Backend Architecture (Production)

For production, extend with:
- **Backend**: Django REST Framework
- **Database**: PostgreSQL
- **Auth**: JWT (djangorestframework-simplejwt)
- **AI**: OpenAI API (GPT-4)
- **Cache**: Redis + Celery
- **Deploy**: Docker + Railway/Render

### Key API Endpoints
```
POST /api/auth/register/
POST /api/auth/login/
GET  /api/activity/today/
POST /api/workouts/
GET  /api/workouts/recommendations/
POST /api/nutrition/meals/
POST /api/ai/coach/chat/
GET  /api/analytics/weekly/
GET  /api/gamification/leaderboard/
```


