@echo off
REM Interactive Supabase Secrets Setup for Windows

setlocal enabledelayedexpansion

echo.
echo =========================================
echo  CAREER COMPASS AI - API KEY SETUP
echo =========================================
echo.
echo Your Supabase Project:
echo Project ID: tuertvenhyerfcdcybxs
echo Dashboard: https://supabase.com/dashboard/project/tuertvenhyerfcdcybxs/settings/secrets
echo.
echo =========================================
echo IMPORTANT: Manual Setup Required
echo =========================================
echo.
echo I can't directly add secrets to your Supabase account,
echo but I've made it super easy to do manually:
echo.
echo STEP 1: Get an API Key (Choose one)
echo ------
echo.
echo Option A - OpenAI (RECOMMENDED):
echo   Go to: https://platform.openai.com/api/keys
echo   Click "Create new secret key"
echo   Copy the key (starts with sk-)
echo.
echo Option B - Lovable (FREE):
echo   Go to: https://lovable.dev
echo   Sign up/in
echo   Get your API key
echo.
echo STEP 2: Add to Supabase (2 minutes)
echo ------
echo.
echo   1. Open browser: https://supabase.com/dashboard/project/tuertvenhyerfcdcybxs/settings/secrets
echo   2. Click "Add new secret"
echo   3. If using OpenAI:
echo      Name: OPENAI_API_KEY
echo      Value: sk-...paste your key...
echo   4. Click "Add secret"
echo.
echo That's it! Your API key is now configured.
echo.
echo.
pause
