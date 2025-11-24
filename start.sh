#!/bin/bash

echo "🚀 Gemini Chat UI - Quick Start"
echo "================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🔧 Starting development server..."
echo "📱 Open http://localhost:3000 in your browser"
echo ""

npm run dev
