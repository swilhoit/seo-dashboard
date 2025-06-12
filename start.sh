#!/bin/bash

# SEO Dashboard Startup Script
echo "Starting SEO Dashboard..."

# Check if Python virtual environment exists
if [ ! -d "./backend/venv" ]; then
    echo "Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r ../requirements.txt
    cd ..
else
    echo "Python virtual environment already exists"
fi

# Start the backend server
echo "Starting backend server..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 2

# Start the frontend development server
echo "Starting frontend server..."
cd frontend
npm install
npm start &
FRONTEND_PID=$!
cd ..

# Function to handle script termination
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

# Register the cleanup function for when script is terminated
trap cleanup SIGINT

echo "SEO Dashboard is running!"
echo "- Backend: http://localhost:5000"
echo "- Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop both servers"

# Keep the script running
wait
