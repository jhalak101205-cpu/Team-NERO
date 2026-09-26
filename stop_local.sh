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

# Stop Collaboration Workspace on Port 3001
COLLAB_PID=$(lsof -ti :3001 2>/dev/null)
if [ -n "$COLLAB_PID" ]; then
    echo "Stopping Collaborative Workspace process (PID $COLLAB_PID)..."
    kill -9 $COLLAB_PID 2>/dev/null
    echo "✅ Collaborative Workspace stopped."
else
    echo "ℹ️ Collaborative Workspace was not running on port 3001."
fi

echo "All BhumiNexus servers have been stopped."

