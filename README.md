# 🚀 Portfolio — Mateusz Dombrowski

> Interactive fullstack developer portfolio with a unique dual-theme: **modern minimalist** & **Windows 95 simulation**

🌐 **Live:** [mateuszdombrowski.com](https://mateuszdombrowski.com)

---

## 📋 Situation

As a Junior Fullstack Developer entering the job market, I needed a portfolio that would stand out among hundreds of generic templates and demonstrate my skills through the project itself.

## 🎯 Task

Build an interactive, memorable portfolio that:
- Showcases projects in an engaging, professional way
- Demonstrates advanced frontend skills (3D, animations, unconventional UI)
- Is fully responsive and accessible

## ⚙️ Action

- Built a **dual theme system** — a modern minimalist layout + a fully functional Windows 95 desktop simulation with draggable & resizable windows
- Implemented an **interactive 3D conference lanyard badge** using Three.js + Rapier Physics engine
- Created smooth animations with **Framer Motion** (SplitText reveals, staggered transitions) and **Lenis** smooth scrolling
- Designed a **Bento Grid** layout with interactive spotlight effects on project cards
- Win95 mode features: Start Menu, Taskbar with live clock, drag & resize windows, BSOD easter egg, Notepad with resume

## 📊 Result

- A portfolio that immediately stands out through creativity and technical depth
- Full responsiveness with mobile-first approach and touch support
- Clean architecture: CSS Modules, Context API, custom hooks, centralized data layer

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Core** | React, Vite,  |
| **3D** | Three.js, React Three Fiber, Rapier Physics |
| **Animation** | Framer Motion, Lenis |
| **Styling** | CSS Modules, CSS Custom Properties |
| **Icons** | Lucide React |
| **Deployment** | GitHub Pages, GitHub Actions CI/CD |

## 🏗️ Architecture

```
src/
├── components/
│   ├── layout/        # RootLayout, ThemeSwitcher
│   ├── modern/        # BentoGrid, ProjectCard, Sections...
│   ├── win95/         # WindowFrame, Taskbar, BSOD...
│   └── shared/        # ErrorBoundary, SmoothScroll
├── context/           # ModeContext (theme), WindowContext (win95)
├── hooks/             # useDrag, useResize, useWindowSize
├── data/              # Centralized portfolio data
├── lanyard/           # 3D Lanyard component (Three.js)
└── styles/            # Global CSS variables & utilities
```

## 🚀 Quick Start

```bash
git clone https://github.com/matidomber/portfolio.git
cd portfolio
npm install
npm run dev
```

## 📦 Build & Preview

```bash
npm run build
npm run preview
```

## 📄 License

MIT © Mateusz Dombrowski
