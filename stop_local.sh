#!/usr/bin/env bash

# BhumiNexus Local Server Shutdown Script

echo "Stopping BhumiNexus local servers..."

# Stop Backend on Port 8000
BACKEND_PID=$(lsof -ti :8000 2>/dev/null)
if [ -n "$BACKEND_PID" ]; then
    echo "Stopping Backend process (PID $BACKEND_PID)..."
    kill -9 $BACKEND_PID 2>/dev/null
    echo "✅ Backend stopped."
else
    echo "ℹ️ Backend was not running on port 8000."
fi

# Stop Frontend on Port 5173
FRONTEND_PID=$(lsof -ti :5173 2>/dev/null)
if [ -n "$FRONTEND_PID" ]; then
    echo "Stopping Frontend process (PID $FRONTEND_PID)..."
    kill -9 $FRONTEND_PID 2>/dev/null
    echo "✅ Frontend stopped."
else
    echo "ℹ️ Frontend was not running on port 5173."
fi

echo "All BhumiNexus servers have been stopped."
