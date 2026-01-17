#!/usr/bin/env python3
"""
Supabase Secret Configuration via API
Adds OPENAI_API_KEY to your Supabase project
"""

import json
import sys

# Your configuration
SUPABASE_PROJECT_ID = "fvckvpxwmmmlriztybee"
SUPABASE_API_URL = "https://api.supabase.com"
OPENAI_API_KEY = "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"

print("=" * 60)
print("Supabase Secret Configuration")
print("=" * 60)
print()
print("Project ID: " + SUPABASE_PROJECT_ID)
print("API Key: " + OPENAI_API_KEY[:20] + "...")
print()
print("⚠️  IMPORTANT NOTES:")
print("=" * 60)
print()
print("Since I cannot directly authenticate with Supabase API,")
print("you need to manually add the secret to your dashboard.")
print()
print("However, here's what you need to do (takes 30 seconds):")
print()
print("1. Go to Supabase Dashboard:")
print("   https://supabase.com/dashboard/project/tuertvenhyerfcdcybxs/settings/secrets")
print()
print("2. Click 'Add new secret'")
print()
print("3. Fill in these values:")
print("   Name:  OPENAI_API_KEY")
print("   Value: " + OPENAI_API_KEY)
print()
print("4. Click 'Add secret'")
print()
print("=" * 60)
print("After adding the secret, run these commands:")
print("=" * 60)
print()
print("supabase functions deploy ats-score")
print("supabase functions deploy analyze-resume")
print("supabase functions deploy optimize-resume")
print()
print("=" * 60)

# Save to a file for reference
with open("api_key_for_supabase.txt", "w") as f:
    f.write("Supabase Project: tuertvenhyerfcdcybxs\n")
    f.write("API Key Name: OPENAI_API_KEY\n")
    f.write("API Key Value: " + OPENAI_API_KEY + "\n")
    f.write("\nDashboard: https://supabase.com/dashboard/project/tuertvenhyerfcdcybxs/settings/secrets\n")

print("\n✅ Your API key has been saved to: api_key_for_supabase.txt")
print("\n")
