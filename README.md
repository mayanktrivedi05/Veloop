# VeLoop Rewards

Frontend dashboard and interactive progression interface for VeLoop Rewards.

## Features

- **Progression Dashboard**: Real-time XP tracking, current tier perks, and milestone progress.
- **Level Roadmap**: Visual milestone tiers with reward breakdown.
- **Next-Level Rewards Preview**: Next tier reward summary and celebratory claim flow.
- **Mini-Game (XP Catcher)**: Canvas-based mini-game with score multiplier and live balance integration.
- **Earning Hub & Missions**: Task list with instant reward completion flow.
- **Recent Activity Feed**: Filterable activity history log.
- **Responsive Layout**: Designed for mobile, tablet, and desktop viewports.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **Icons**: Lucide React
- **Animations / FX**: canvas-confetti, Web Audio API

## Project Structure

```
src/
├── components/       # Feature-specific UI components
│   ├── ActivityModal
│   ├── BottomNav
│   ├── EarnMoreSection
│   ├── Header
│   ├── LevelHero
│   ├── LevelRoadmap
│   ├── LevelUpModal
│   ├── NextLevelReward
│   ├── PlayAndEarn
│   ├── RecentActivity
│   ├── StateViews
│   └── TodayBoost
├── data/             # Initial mock data and level tiers
├── hooks/            # Progression and state logic
├── pages/            # Main dashboard page layout
├── styles/           # Global styles and design tokens
└── utils/            # Helper utilities (sound fx, formatters)
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm / yarn / pnpm

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```
