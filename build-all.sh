#!/bin/bash
# Build script for all packages

echo "🔨 Building Minigame Battle Royale..."

# Build shared package
echo ""
echo "📦 Building shared package..."
cd shared
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Shared build failed!"
    exit 1
fi
echo "✅ Shared package built successfully!"

# Build server
echo ""
echo "🖥️  Building server..."
cd ../server
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Server build failed!"
    exit 1
fi
echo "✅ Server built successfully!"

# Build client
echo ""
echo "🌐 Building client..."
cd ../client
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Client build failed!"
    exit 1
fi
echo "✅ Client built successfully!"

cd ..
echo ""
echo "🎉 All packages built successfully!"
echo ""
echo "Build outputs:"
echo "  - shared/dist"
echo "  - server/dist"
echo "  - client/dist"

