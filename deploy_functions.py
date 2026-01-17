#!/usr/bin/env python3
"""
Deploy Supabase Functions via API
This script deploys functions to your Supabase project
"""

import os
import subprocess
import json

# Configuration
PROJECT_ID = "fvckvpxwmmmlriztybee"
FUNCTIONS = ["ats-score", "analyze-resume", "optimize-resume"]

print("=" * 70)
print("Supabase Functions Deployment")
print("=" * 70)
print()
print(f"Project ID: {PROJECT_ID}")
print(f"Functions to deploy: {', '.join(FUNCTIONS)}")
print()

# Try using Docker to run Supabase CLI
print("Checking for Docker...")
try:
    result = subprocess.run(["docker", "--version"], capture_output=True, text=True)
    if result.returncode == 0:
        print(f"✅ Docker found: {result.stdout.strip()}")
        print()
        print("Deploying functions using Docker...")
        print()
        
        for func in FUNCTIONS:
            print(f"Deploying {func}...")
            cmd = [
                "docker", "run",
                "-v", f"{os.getcwd()}:/workspace",
                "-w", "/workspace",
                "supabase/cli",
                "functions", "deploy", func
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ {func} deployed successfully!")
            else:
                print(f"⚠️  {func} deployment output:")
                print(result.stdout)
                print(result.stderr)
    else:
        raise Exception("Docker not available")
        
except Exception as e:
    print(f"❌ Docker not available: {e}")
    print()
    print("=" * 70)
    print("MANUAL DEPLOYMENT REQUIRED")
    print("=" * 70)
    print()
    print("Please install Supabase CLI from:")
    print("https://supabase.com/docs/guides/cli/getting-started")
    print()
    print("Then run these commands:")
    print()
    for func in FUNCTIONS:
        print(f"  supabase functions deploy {func}")
    print()
    print("Or use the web interface:")
    print(f"https://supabase.com/dashboard/project/{PROJECT_ID}/functions")
