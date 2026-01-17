@echo off
REM Supabase Functions Manual Deployment Guide

echo.
echo =========================================================
echo DEPLOY SUPABASE FUNCTIONS - MANUAL WEB INTERFACE GUIDE
echo =========================================================
echo.
echo Your Supabase project has been created with the API key.
echo Now you need to deploy the 3 Edge Functions.
echo.
echo =========================================================
echo OPTION 1: Deploy via Supabase Web Interface (EASIEST)
echo =========================================================
echo.
echo 1. Open your browser and go to:
echo    https://supabase.com/dashboard/project/fvckvpxwmmmlriztybee/functions
echo.
echo 2. Click "+ Create a new function"
echo.
echo 3. For FIRST function (ats-score):
echo    - Name: ats-score
echo    - Open: supabase\functions\ats-score\index.ts
echo    - Copy ALL the code
echo    - Paste into the web editor
echo    - Click "Deploy"
echo.
echo 4. Repeat for SECOND function (analyze-resume):
echo    - Name: analyze-resume
echo    - Copy from: supabase\functions\analyze-resume\index.ts
echo    - Paste and Deploy
echo.
echo 5. Repeat for THIRD function (optimize-resume):
echo    - Name: optimize-resume
echo    - Copy from: supabase\functions\optimize-resume\index.ts
echo    - Paste and Deploy
echo.
echo =========================================================
echo OPTION 2: If You Have Supabase CLI Installed
echo =========================================================
echo.
echo Run these commands:
echo.
echo   supabase functions deploy ats-score
echo   supabase functions deploy analyze-resume
echo   supabase functions deploy optimize-resume
echo.
echo =========================================================
echo AFTER DEPLOYMENT
echo =========================================================
echo.
echo Once all 3 functions are deployed:
echo   1. Go to: http://localhost:8081/ats-score
echo   2. Upload a resume
echo   3. Click "Analyze ATS Score"
echo   4. It should work! ✓
echo.
echo =========================================================
echo.
start https://supabase.com/dashboard/project/fvckvpxwmmmlriztybee/functions
echo Opening Supabase Functions page in browser...
echo.
pause
