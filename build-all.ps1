# Build script for all packages
Write-Host "🔨 Building Minigame Battle Royale..." -ForegroundColor Cyan

# Build shared package
Write-Host "`n📦 Building shared package..." -ForegroundColor Yellow
Set-Location shared
npm install
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Shared build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Shared package built successfully!" -ForegroundColor Green

# Build server
Write-Host "`n🖥️  Building server..." -ForegroundColor Yellow
Set-Location ../server
npm install
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Server build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Server built successfully!" -ForegroundColor Green

# Build client
Write-Host "`n🌐 Building client..." -ForegroundColor Yellow
Set-Location ../client
npm install
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Client build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Client built successfully!" -ForegroundColor Green

Set-Location ..
Write-Host "`n🎉 All packages built successfully!" -ForegroundColor Green
Write-Host "`nBuild outputs:" -ForegroundColor Cyan
Write-Host "  - shared/dist" -ForegroundColor White
Write-Host "  - server/dist" -ForegroundColor White
Write-Host "  - client/dist" -ForegroundColor White

