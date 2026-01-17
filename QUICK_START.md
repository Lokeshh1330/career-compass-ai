# QUICK START: Add API Keys to Your Supabase Project

## ⚡ 3-Minute Setup

### Step 1: Get Your API Key (Pick One)

#### Option A: OpenAI (RECOMMENDED - Better Quality)
1. Open: https://platform.openai.com/api/keys
2. Click "Create new secret key"
3. Copy it (starts with `sk-`)
4. ✅ You have your API key!

#### Option B: Lovable (FREE - Quick Setup)
1. Open: https://lovable.dev
2. Sign up or sign in
3. Get your API key from settings
4. ✅ You have your API key!

---

### Step 2: Add Secret to Supabase Dashboard (1 minute)

1. **Open this link directly:**
   ```
   https://supabase.com/dashboard/project/tuertvenhyerfcdcybxs/settings/secrets
   ```

2. **Click "Add new secret"**

3. **Fill in the form:**
   - **Name:** `OPENAI_API_KEY` (or `LOVABLE_API_KEY`)
   - **Value:** Paste your API key from Step 1

4. **Click "Add secret"**

5. ✅ Your secret is now active!

---

### Step 3: Deploy Functions (30 seconds)

Open terminal and run:

```bash
supabase functions deploy ats-score
supabase functions deploy analyze-resume
supabase functions deploy optimize-resume
```

Or use Docker if supabase CLI isn't available:
```bash
docker run -v "%CD%:/workspace" supabase/cli functions deploy
```

---

### Step 4: Test Everything! 🚀

```bash
npm run dev
```

Then:
- Go to: http://localhost:8080/ats-score
- Upload your resume
- Click "Analyze ATS Score"
- 🎉 It should work!

---

## 🆘 Troubleshooting

**"API key not configured" error?**
- Check that the secret was actually saved in Supabase
- Verify the name is exactly: `OPENAI_API_KEY` or `LOVABLE_API_KEY`
- Wait 30 seconds for changes to propagate

**Still not working?**
1. Check browser console (F12) for error details
2. Go to Supabase Dashboard → Functions → Logs
3. Look for the function error message
4. Share the error in console

---

## Direct Links (Copy & Paste)

Your Supabase Project:
- **Dashboard:** https://supabase.com/dashboard/project/tuertvenhyerfcdcybxs
- **Secrets Page:** https://supabase.com/dashboard/project/tuertvenhyerfcdcybxs/settings/secrets
- **Function Logs:** https://supabase.com/dashboard/project/tuertvenhyerfcdcybxs/functions

API Key Services:
- **OpenAI Keys:** https://platform.openai.com/api/keys
- **Lovable:** https://lovable.dev

---

That's it! You're all set! 🎊
