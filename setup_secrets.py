#!/usr/bin/env python3
"""
Supabase Function Secrets Configuration Script
This script adds API keys to your Supabase project functions
"""

import subprocess
import json
import sys
import os

def check_supabase_cli():
    """Check if Supabase CLI is installed"""
    try:
        result = subprocess.run(['supabase', '--version'], capture_output=True, text=True)
        return True
    except FileNotFoundError:
        print("❌ Supabase CLI not found")
        print("Install from: https://supabase.com/docs/guides/cli/getting-started")
        return False

def add_secret(name, value):
    """Add a secret to Supabase using CLI"""
    try:
        # Supabase CLI command to set secret
        cmd = [
            'supabase',
            'secrets',
            'set',
            f'{name}={value}'
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ {name} added successfully")
            return True
        else:
            print(f"❌ Failed to add {name}")
            print(result.stderr)
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def deploy_functions():
    """Deploy functions to Supabase"""
    functions = ['ats-score', 'analyze-resume', 'optimize-resume']
    
    for func in functions:
        try:
            print(f"Deploying {func}...")
            cmd = ['supabase', 'functions', 'deploy', func]
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"✅ {func} deployed successfully")
            else:
                print(f"❌ Failed to deploy {func}")
                print(result.stderr)
        except Exception as e:
            print(f"❌ Error deploying {func}: {e}")

def main():
    print("\n" + "="*50)
    print("Career Compass AI - Secret Configuration")
    print("="*50 + "\n")
    
    # Check if Supabase CLI is available
    if not check_supabase_cli():
        sys.exit(1)
    
    # Get API key from user
    print("\n1️⃣ Get your API key:")
    print("   OpenAI: https://platform.openai.com/api/keys")
    print("   Lovable: https://lovable.dev")
    
    print("\n2️⃣ Enter your API key configuration:\n")
    
    use_openai = input("Do you want to use OpenAI? (y/n): ").lower() == 'y'
    
    if use_openai:
        openai_key = input("Enter your OpenAI API key (sk-...): ").strip()
        if openai_key:
            if add_secret('OPENAI_API_KEY', openai_key):
                model = input("Enter OpenAI model [gpt-4o-mini]: ").strip() or 'gpt-4o-mini'
                add_secret('OPENAI_MODEL', model)
    else:
        lovable_key = input("Enter your Lovable API key: ").strip()
        if lovable_key:
            add_secret('LOVABLE_API_KEY', lovable_key)
    
    # Deploy functions
    print("\n3️⃣ Deploying functions...")
    deploy_functions()
    
    print("\n" + "="*50)
    print("✅ Setup complete!")
    print("="*50)
    print("\nNext steps:")
    print("1. Run: npm run dev")
    print("2. Visit: http://localhost:8080/ats-score")
    print("3. Upload a resume to test")

if __name__ == '__main__':
    main()
