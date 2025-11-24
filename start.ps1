# Quick Start Script for PowerShell

Write-Host "🚀 Gemini Chat UI - Quick Start" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Starting development server..." -ForegroundColor Yellow
Write-Host "📱 Open http://localhost:3000 in your browser" -ForegroundColor Cyan
Write-Host ""

npm run dev
