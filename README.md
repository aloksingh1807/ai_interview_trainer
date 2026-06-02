# Alok AI – Premium AI SaaS Interview Trainer 🚀

A high-performance, production-ready AI Interview Preparation platform engineered with Vision Pro-style frosted glass layouts (**Apple Tahoe Design**), dynamic theme-tint overlays, real-time speech analytics, and Monaco code sandboxes. 

Alok AI empowers candidates to master technical, HR, and behavioral interview loops through an immersive, highly interactive mock simulator companion.

---

## ✨ Features & Visual Highlights

### 🎨 Apple Tahoe Design & Accent Tinting
- **Apple Liquid Glass Mode (Light)** & **Antigravity Cyberpunk Mode (Dark)** with dynamic backdrop blurs.
- **5-Accent Custom Tint Overlays**: Instant real-time UI theme tint changes (`Blue`, `Purple`, `Green`, `Orange`, `Red`) saved inside localStorage context.
- Frosted translucent glass cards, glare reflection outlines, and macOS-grade layered box shadows.

### 🗺️ Visual AI Career Progression Roadmap
- **7 Specialized Tech tracks**: Tailored career target selectors (AI Engineer, Data Scientist, Full Stack, Cloud, DevOps, etc.).
- **9-Node Interactive Mastery Pipeline**: Track milestones from Python basics to coding mock loops.
- **Dynamic Mastery Indexes**: Animated circular progress ring tracks active tech coverage.
- **ATS Recommendation Scanners**: Personalized suggestions compiled against CV scanning statistics.

### 🎙️ Immersive Face-to-Face Simulation Room
- **Cybernetic Avatar Assistant**: "Alok AI" interviewer acts as the vocal evaluator and question guide.
- **Vocal Transcription & Synthesis**: Continuous web speech integration (SpeechRecognition & SpeechSynthesis) for natural face-to-face vocal exchanges.
- **Live Video Webcam Inputs**: Dynamic physical presence mapping inside setup panels.
- **Premium Scorecards**: Phase-by-phase complete overall readiness dials, Kommunication ratings, and actionable recruiter tips.

### 💻 Monaco Technical Code Sandboxes
- **Integrated Editor Grids**: Embedded Monaco Editor workspace with multi-language setups (Python, JS).
- **Dynamic Local Execution**: Compile and execute algorithm test cases locally inside sandboxed stdout terminals.
- **AI Scorecard Assessment**: Submit solutions to receive automatic complexity evaluations, optimization checklists, and advice.

### 📄 Enterprise ATS Resume Screener
- **HTML5 Drag & Drop zone**: Advanced drop listener with bounce animations and glow overlay states.
- **Formatting Strengths & Missing Gaps**: Scan keyword density against industry roles and receive recommendations.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18, Vite
- **Styling**: TailwindCSS, CSS Variable Mode Architecture (HSL dynamic accent scales)
- **Animations**: Framer Motion, GPU-composited smooth backdrops
- **Icons & Controls**: Lucide React
- **Code Editor**: Monaco Editor React (`@monaco-editor/react`)

### Backend
- **Framework**: Flask (Python 3)
- **Database**: MongoDB (with automated `MemoryDatabase` local memory fallbacks)
- **Authentication**: JSON Web Token (JWT) scopes & secure bcrypt salt hashing
- **Document Parsers**: PyPDF

---

## 🚀 Quick Start Guide

### 1. Configure the Backend API
```bash
# Navigate to backend folder
cd backend

# Create & activate a Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask API server
python app.py

# Navigate to frontend folder
cd frontend

# Install package dependencies
npm install

# Start the Vite local server
npm run dev

ai_interview_trainer/
├── frontend/             # React 18 Vite workspace
│   ├── src/
│   │   ├── components/   # Floating Docks, Avatars, Canvas, Error Boundaries
│   │   ├── pages/        # Dashboard, Simulator Room, ATS Screener, Roadmaps
│   │   └── index.css     # HSL Tint CSS Design System tokens
│   └── package.json
└── backend/              # Python Flask API workspace
    ├── database/         # MongoDB and in-memory mock fallback collections
    ├── app.py            # API routing controllers and LLM prompt compilers
    └── requirements.txt
🛡️ License & Attributions
Built with 💙 by Alok Singh. Inspired by stripe, linear, and modern AI startups.
