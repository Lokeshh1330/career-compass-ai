# Career Compass AI - Setup & Troubleshooting Guide

## 🔴 Current Issues & Solutions

Your project was broken because **critical API keys are missing**. Here's what needs to be fixed:

---

## ❌ Problem 1: ATS Checker & Resume Analysis Not Working

**Root Cause:** The Supabase Edge Functions need AI API keys to process resume analysis.

### Solution: Add API Keys to Supabase

You need to configure these secrets in your Supabase project:

#### Option A: Using Lovable API (Recommended for quick setup)

1. Go to [Lovable](https://lovable.dev) and get your `LOVABLE_API_KEY`
2. In Supabase Dashboard:
   - Navigate to **Project Settings → Secrets**
   - Add new secret:
     - Key: `LOVABLE_API_KEY`
     - Value: `your-lovable-api-key`
   - Save and redeploy functions

#### Option B: Using OpenAI (Better for production)

1. Get your `OPENAI_API_KEY` from [OpenAI](https://platform.openai.com)
2. In Supabase Dashboard:
   - Navigate to **Project Settings → Secrets**
   - Add new secrets:
     - Key: `OPENAI_API_KEY`
     - Value: `sk-...your-openai-key`
     - Key: `OPENAI_MODEL` (optional)
     - Value: `gpt-4o-mini` or `gpt-4`
   - Save and redeploy functions

#### Option C: Using Both (Recommended for reliability)

Set up both API keys. The system will use OpenAI if available, otherwise fall back to Lovable.

### Steps to Deploy (After Adding Secrets):

1. Open terminal in project root
2. Run: `supabase functions deploy ats-score`
3. Run: `supabase functions deploy analyze-resume`
4. Run: `supabase functions deploy optimize-resume`

---

## ❌ Problem 2: Sign-Up Page Not Working

**Root Cause:** Supabase email confirmation may not be configured, or email verification is blocking signup.

### Solution: Configure Supabase Auth

1. Go to Supabase Dashboard → Authentication → Providers
2. Make sure **Email Provider** is enabled
3. Check **Email Templates** → Confirm Sign Up Email
4. Go to **Authentication → Policies** and enable:
   - ✅ Confirm email
   - Or disable email confirmation for development (not recommended for production)

### To Allow Signup Without Email Verification (Development):

1. Supabase Dashboard → Settings → Auth
2. Find "Enable email confirmations"
3. Uncheck if you want instant signup (development only!)

### To Test Auth Locally:

```bash
# Terminal 1: Start Supabase local
supabase start

# Terminal 2: Start the app
npm run dev
```

---

## ✅ What I Fixed

### Frontend Improvements:

1. **Better Error Messages** - Users now see helpful error messages explaining what's wrong
2. **API Header Fix** - Added proper authorization headers to function calls
3. **Improved Logging** - Console logs show what's happening for debugging
4. **Auth Feedback** - Sign-up now shows if email confirmation is needed

### File Changes:

- `src/pages/ATSScore.tsx` - Enhanced error handling for ATS analysis
- `src/pages/Analyze.tsx` - Added better logging and error messages
- `src/pages/Auth.tsx` - Improved signup flow with email confirmation support

---

## 🚀 Quick Verification Steps

### 1. Check if API keys are configured:
```
Supabase Dashboard → Project Settings → Secrets
Look for: LOVABLE_API_KEY or OPENAI_API_KEY
```

### 2. Rebuild and test ATS Score:
```bash
npm run build
npm run dev
```
- Go to http://localhost:8080/ats-score
- Upload a resume
- Click "Analyze ATS Score"
- Check browser console (F12) for errors

### 3. Test Resume Analysis:
```
Go to http://localhost:8080/analyze
Upload resume + Job description
Click "Analyze Compatibility"
Check for results
```

### 4. Test Sign-Up:
```
Go to http://localhost:8080/auth
Try to create an account
Check toast notifications and console for errors
```

---

## 📋 Supabase Function Configuration

All functions are configured in `supabase/config.toml`:

```toml
[functions.ats-score]
verify_jwt = false  # Public access

[functions.analyze-resume]
verify_jwt = false  # Public access

[functions.optimize-resume]
verify_jwt = false  # Public access
```

These need secrets to work. The functions will fail gracefully if secrets are missing.

---

## 🐛 Debugging Tips

### If ATS Analysis Still Fails:
1. Check browser console for the actual error message
2. Go to Supabase Dashboard → Functions → Logs
3. Look for `ats-score` function logs
4. Verify `LOVABLE_API_KEY` is set and valid

### If Resume Analysis Fails:
1. Check browser console error message
2. Check Supabase function logs for `analyze-resume`
3. Ensure job description is longer than 50 characters
4. Verify OpenAI/Lovable API key is working

### If Sign-Up Fails:
1. Check Supabase Dashboard → Auth → Users
2. Verify email provider is enabled
3. Check if "Confirm email" setting is blocking signups
4. Look at browser console for specific error

---

## 📞 Support Checklist

- [ ] API keys added to Supabase secrets
- [ ] Functions deployed after adding secrets
- [ ] Browser console shows no CORS errors
- [ ] Supabase project is active (not paused)
- [ ] Network requests show 200 status code
- [ ] Auth email provider is enabled

---

## 🔄 Rebuild After Fixes

```bash
# Clear cache and rebuild
npm run build
npm run dev
```

Then test all features:
- Sign up at `/auth`
- Upload resume and check ATS score at `/ats-score`
- Analyze compatibility at `/analyze`

---

**Last Updated:** January 17, 2026
**Project:** Career Compass AI
