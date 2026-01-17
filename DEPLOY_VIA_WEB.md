# Deploy Supabase Functions via Web Interface

## Quick Deploy (5 minutes)

Your Supabase Functions page is already open at:
https://supabase.com/dashboard/project/fvckvpxwmmmlriztybee/functions

### Steps:

#### 1. Deploy ats-score Function

1. Go to Functions page
2. Click **"Create a new function"** (or "Deploy new function")
3. Name: `ats-score`
4. Copy the code from: `supabase/functions/ats-score/index.ts`
5. Paste into the editor
6. Click **"Deploy"**

#### 2. Deploy analyze-resume Function

1. Click **"Create a new function"** again
2. Name: `analyze-resume`
3. Copy from: `supabase/functions/analyze-resume/index.ts`
4. Paste into the editor
5. Click **"Deploy"**

#### 3. Deploy optimize-resume Function

1. Click **"Create a new function"** again
2. Name: `optimize-resume`
3. Copy from: `supabase/functions/optimize-resume/index.ts`
4. Paste into the editor
5. Click **"Deploy"**

---

## Verify Deployment

After deploying, you should see all 3 functions listed in your Functions page.

Then test:
1. Go to http://localhost:8081/ats-score
2. Upload a resume
3. Click "Analyze ATS Score"
4. It should work! ✅

---

## Alternative: Use Local Supabase (Optional)

If you want to test locally with local functions:

```bash
supabase start
supabase functions serve
```

Then the functions will work at http://localhost:3000 (edge functions)

---

## Need Help?

Contact Supabase support or check the docs:
https://supabase.com/docs/guides/functions
