#!/usr/bin/env python3
"""
Quick Supabase CLI Download and Deploy Script
"""

import urllib.request
import os
import zipfile
import subprocess
import shutil
import platform

PROJECT_ID = "fvckvpxwmmmlriztybee"
FUNCTIONS = ["ats-score", "analyze-resume", "optimize-resume"]

print("=" * 70)
print("Installing Supabase CLI...")
print("=" * 70)

# Download Supabase CLI
system = platform.system()
if system == "Windows":
    cli_name = "supabase-windows-amd64.zip"
else:
    cli_name = f"supabase-{system.lower()}-amd64.tar.gz"

url = f"https://github.com/supabase/cli/releases/latest/download/{cli_name}"

print(f"Downloading from: {url}")

try:
    # Download the CLI
    print("Downloading Supabase CLI...")
    urllib.request.urlretrieve(url, cli_name)
    print(f"✅ Downloaded {cli_name}")
    
    # Extract
    if cli_name.endswith(".zip"):
        print("Extracting...")
        with zipfile.ZipFile(cli_name, 'r') as zip_ref:
            zip_ref.extractall(".")
        print("✅ Extracted")
    
    # Find the executable
    supabase_exe = "supabase.exe" if system == "Windows" else "supabase"
    
    if os.path.exists(supabase_exe):
        print(f"✅ Found {supabase_exe}")
        
        # Deploy functions
        print()
        print("=" * 70)
        print("Deploying Functions...")
        print("=" * 70)
        
        for func in FUNCTIONS:
            print(f"\nDeploying {func}...")
            result = subprocess.run([f"./{supabase_exe}", "functions", "deploy", func], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ {func} deployed!")
            else:
                print(f"Error: {result.stderr}")
    else:
        print(f"❌ Could not find {supabase_exe}")
        
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nManual deployment required.")
    print("Download from: https://github.com/supabase/cli/releases")

print("\nDone!")
