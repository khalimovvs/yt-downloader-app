@echo off
title YTLoader - Ishga tushirilmoqda...
color 0A

echo.
echo  ==========================================
echo   YTLoader - YouTube Video Yuklovchi
echo  ==========================================
echo.

:: Node.js borligini tekshirish
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo  [XATO] Node.js o'rnatilmagan!
    echo.
    echo  Iltimos Node.js o'rnating:
    echo  https://nodejs.org/en/download
    echo.
    pause
    exit /b 1
)

echo  [1/4] Node.js topildi: 
node --version

:: Backend dependencies
echo.
echo  [2/4] Backend kutubxonalari o'rnatilmoqda...
cd /d "%~dp0backend"
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo  [XATO] Backend o'rnatishda muammo!
        pause
        exit /b 1
    )
)
echo  Backend tayyor!

:: Frontend dependencies
echo.
echo  [3/4] Frontend kutubxonalari o'rnatilmoqda...
cd /d "%~dp0frontend"
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo  [XATO] Frontend o'rnatishda muammo!
        pause
        exit /b 1
    )
)
echo  Frontend tayyor!

:: Start both servers
echo.
echo  [4/4] Serverlar ishga tushirilmoqda...
echo.
echo  Backend: http://localhost:3001
echo  Frontend: http://localhost:5173
echo.

:: Start backend in new window
start "YTLoader Backend" cmd /k "cd /d "%~dp0backend" && node server.js"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend in new window
start "YTLoader Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

:: Open browser after delay
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo  Brauzer ochildi! Agar avtomatik ochilmasa:
echo  http://localhost:5173 manzilini oching
echo.
echo  Dasturni yopish uchun har ikkala terminal oynasini yoping.
pause
