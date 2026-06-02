#!/bin/bash

# ════════════════════════════════════════════════════════
#          INTERVIEW TRAINER STARTUP Blueprints
# ════════════════════════════════════════════════════════

echo "⚡ Launching 'interview trainer' Cockpit..."

# Absolute path
PROJECT_DIR="/Users/aloksingh/.gemini/antigravity/scratch/ai_interview_trainer"

# 1. Initialize Python venv & backend deps
echo "🐍 Preparing Backend Virtual Environment..."
cd "$PROJECT_DIR/backend"
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "Installing backend requirements..."
pip install --upgrade pip
pip install -r requirements.txt

# Start Backend Server asynchronously in background on port 5001
echo "🚀 Activating Backend Flask Server on http://localhost:5001..."
export PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python
python3 app.py > backend.log 2>&1 &
BACKEND_PID=$!

# 2. Check Node packages & start Frontend
echo "⚛️ Launching React Frontend Dev Server..."
cd "$PROJECT_DIR/frontend"
if [ ! -d "node_modules" ]; then
    echo "Stale workspace. Installing npm dependencies..."
    npm install
fi

# Start Frontend Dev Server asynchronously in background on port 5173
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Trap signals to shut down both processes cleanly on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}
trap cleanup SIGINT SIGTERM

echo "════════════════════════════════════════════════════════"
echo "✅ BOTH SERVERS STARTED!"
echo "👉 OPEN IN BROWSER: http://localhost:5173"
echo "════════════════════════════════════════════════════════"
echo "Press Ctrl+C to stop both servers."

# Wait for background jobs
wait
