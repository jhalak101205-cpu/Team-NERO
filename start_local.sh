#!/usr/bin/env bash

# BhumiNexus Local & LAN Hosting Script
# Automatically binds and serves BhumiNexus on your Mac's Localhost and Wi-Fi Network

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Get current LAN IP address (Wi-Fi or Ethernet)
LAN_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")

echo "=========================================================="
echo "🇮🇳 Starting BhumiNexus National Land Governance Platform"
echo "=========================================================="
echo "Detected LAN IP: $LAN_IP"
echo ""

# 1. Start Backend if not already running on port 8000
if lsof -i :8000 -sTCP:LISTEN >/dev/null 2>&1; then
    echo "✅ Backend API is already running on port 8000."
else
    echo "🚀 Starting FastAPI Backend on 0.0.0.0:8000..."
    cd "$BACKEND_DIR"
    if [ -d "venv" ]; then
        source venv/bin/activate
    fi
    nohup uvicorn main:app --host 0.0.0.0 --port 8000 --reload > "$BACKEND_DIR/backend.log" 2>&1 &
    sleep 3
    if lsof -i :8000 -sTCP:LISTEN >/dev/null 2>&1; then
        echo "✅ Backend started successfully."
    else
        echo "⚠️ Backend failed to start. Check $BACKEND_DIR/backend.log"
    fi
fi

# 2. Start Frontend if not already running on port 5173
if lsof -i :5173 -sTCP:LISTEN >/dev/null 2>&1; then
    echo "✅ Frontend Web App is already running on port 5173."
else
    echo "🚀 Starting Vite Frontend on 0.0.0.0:5173..."
    cd "$FRONTEND_DIR"
    CI=true nohup node ./node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5173 > "$FRONTEND_DIR/frontend.log" 2>&1 &
    sleep 3
    if lsof -i :5173 -sTCP:LISTEN >/dev/null 2>&1; then
        echo "✅ Frontend started successfully."
    else
        echo "⚠️ Frontend failed to start. Check $FRONTEND_DIR/frontend.log"
    fi
fi

echo ""
echo "=========================================================="
echo "🎉 BhumiNexus is LIVE and accessible at:"
echo "=========================================================="
echo "💻 On this Mac:"
echo "   - Web App:                 http://localhost:5173"
echo "   - API Docs:                http://localhost:8000/docs"
echo "   - Collaborative Workspace: http://localhost:3001"
echo ""
echo "📱 On any Phone, Tablet, or PC connected to your Wi-Fi:"
echo "   - Web App:                 http://$LAN_IP:5173"
echo "   - API Gateway:             http://$LAN_IP:8000"
echo "   - Collaborative Workspace: http://$LAN_IP:3001"
echo "=========================================================="
echo "To stop the servers, run: ./stop_local.sh"
echo ""
