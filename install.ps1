# Minigame Battle Royale - Installation Script
# Run this script to install all dependencies

Write-Host "🎮 Minigame Battle Royale - Installation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js installation
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found! Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install root dependencies
Write-Host ""
Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Root dependencies installed" -ForegroundColor Green

# Install shared package
Write-Host ""
Write-Host "Installing shared package..." -ForegroundColor Yellow
Set-Location shared
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install shared package" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ Shared package installed" -ForegroundColor Green

# Build shared package
Write-Host ""
Write-Host "Building shared package..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to build shared package" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ Shared package built" -ForegroundColor Green
Set-Location ..

# Install server dependencies
Write-Host ""
Write-Host "Installing server dependencies..." -ForegroundColor Yellow
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install server dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ Server dependencies installed" -ForegroundColor Green
Set-Location ..

# Install client dependencies
Write-Host ""
Write-Host "Installing client dependencies..." -ForegroundColor Yellow
Set-Location client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install client dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ Client dependencies installed" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the game:" -ForegroundColor Yellow
Write-Host "  1. Open a terminal and run: cd server && npm run dev" -ForegroundColor White
Write-Host "  2. Open another terminal and run: cd client && npm run dev" -ForegroundColor White
Write-Host "  3. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "See SETUP.md for detailed instructions!" -ForegroundColor Cyan

