@echo off
REM Supabase Function Secrets Setup Script for Windows

echo.
echo ==========================================
echo Career Compass AI - Supabase Setup
echo ==========================================
echo.
echo Your Supabase Project ID: tuertvenhyerfcdcybxs
echo Supabase URL: https://tuertvenhyerfcdcybxs.supabase.co
echo.
echo ==========================================
echo STEP 1: Get an API Key
echo ==========================================
echo.
echo Option A - OpenAI (Recommended):
echo   1. Go to: https://platform.openai.com/api/keys
echo   2. Create a new API key
echo   3. Copy the key starting with 'sk-'
echo.
echo Option B - Lovable (Free):
echo   1. Go to: https://lovable.dev
echo   2. Sign in and get your API key
echo.
echo ==========================================
echo STEP 2: Add Secret to Supabase Dashboard
echo ==========================================
echo.
echo   1. Go to: https://supabase.com/dashboard/project/tuertvenhyerfcdcybxs
echo   2. Click on "Settings" (gear icon)
echo   3. Go to "Secrets" tab
echo   4. Click "Add Secret"
echo   5. For OpenAI:
echo      - Name: OPENAI_API_KEY
echo      - Value: sk-...paste your key here...
echo   6. Click "Create new secret"
echo.
echo ==========================================
echo STEP 3: Deploy Functions
echo ==========================================
echo.
echo Run these commands in terminal:
echo   supabase functions deploy ats-score
echo   supabase functions deploy analyze-resume
echo   supabase functions deploy optimize-resume
echo.
echo ==========================================
echo STEP 4: Test
echo ==========================================
echo.
echo   npm run dev
echo   Then visit: http://localhost:8080/ats-score
echo.
pause
