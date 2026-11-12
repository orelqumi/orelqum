@echo off
setlocal
cd /d "%~dp0"
echo.
echo ORELQUMI - Cloudflare Pages deployment
echo This replaces your current published website files on orelqum.pages.dev.
echo Your D1 database will NOT be deleted.
echo.
if not exist "public\index.html" (
 echo ERROR: public\index.html missing. Extract the entire ZIP first.
 pause
 exit /b 1
)
if not exist "functions\api\portal\login.js" (
 echo ERROR: CRM functions missing. Extract the entire ZIP first.
 pause
 exit /b 1
)
where wrangler >nul 2>nul
if errorlevel 1 (
 echo ERROR: Wrangler not found. Install with npm install -g wrangler
 pause
 exit /b 1
)
choice /m "Deploy to existing Cloudflare project orelqum"
if errorlevel 2 exit /b 0
wrangler pages deploy public --project-name orelqum --branch main
if errorlevel 1 (
 echo.
 echo DEPLOYMENT FAILED. See the message above. Do not try to recreate your D1 database.
) else (
 echo.
 echo Deployment command completed. Check dashboard login and Paystack test mode.
)
pause
