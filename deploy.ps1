$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Supabase CLI Installation & Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if scoop is installed
$scoopInstalled = Get-Command scoop -ErrorAction SilentlyContinue

if (-not $scoopInstalled) {
    Write-Host "Installing Scoop..." -ForegroundColor Yellow
    iex (New-Object Net.WebClient).DownloadString('https://get.scoop.sh')
}

Write-Host "Installing Supabase CLI via Scoop..." -ForegroundColor Yellow
scoop install supabase

Write-Host ""
Write-Host "✅ Supabase CLI installed!" -ForegroundColor Green
Write-Host ""
Write-Host "Now deploying functions..." -ForegroundColor Cyan
Write-Host ""

# Deploy functions
$functions = @("ats-score", "analyze-resume", "optimize-resume")

foreach ($func in $functions) {
    Write-Host "Deploying $func..." -ForegroundColor Yellow
    supabase functions deploy $func
    Write-Host "✅ $func deployed!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ All functions deployed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Go to: http://localhost:8081/ats-score" -ForegroundColor Cyan
Write-Host ""
