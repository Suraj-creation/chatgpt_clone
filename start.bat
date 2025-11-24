@echo off
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b %errorlevel%
)

echo.
echo Starting development server...
echo Open http://localhost:3000 in your browser
echo.
call npm run dev
