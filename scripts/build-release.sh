#!/bin/bash
set -e

echo "🚀 Building Solar Dashboard Release..."
echo ""


ls

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${BLUE}Project root: $PROJECT_ROOT${NC}"
echo ""

# Always work from project root
cd "$PROJECT_ROOT"

# Install dependencies
echo -e "${BLUE}Step 1: Installing dependencies...${NC}"
pnpm install --frozen-lockfile
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Build main application with Tauri
echo ""
echo -e "${BLUE}Step 3: Building Tauri application...${NC}"
echo -e "${BLUE}Working directory: $(pwd)${NC}"
NO_STRIP=true pnpm tauri build

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Build complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Find and list created installers
BUNDLE_DIR="target/release/bundle"
if [ -d "$BUNDLE_DIR" ]; then
    echo -e "${YELLOW}📦 Created installers:${NC}"
    echo ""
    
    # macOS
    if [ -d "$BUNDLE_DIR/macos" ]; then
        echo -e "  ${BLUE}macOS:${NC}"
        find "$BUNDLE_DIR/macos" -maxdepth 1 -name "*.app" -exec echo "    📱 {}" \;
    fi
    
    if [ -d "$BUNDLE_DIR/dmg" ]; then
        echo -e "  ${BLUE}DMG Installer:${NC}"
        find "$BUNDLE_DIR/dmg" -name "*.dmg" -exec echo "    💿 {}" \;
    fi
    
    # Linux
    if [ -d "$BUNDLE_DIR/deb" ]; then
        echo -e "  ${BLUE}Debian Package:${NC}"
        find "$BUNDLE_DIR/deb" -name "*.deb" -exec echo "    📦 {}" \;
    fi
    
    if [ -d "$BUNDLE_DIR/appimage" ]; then
        echo -e "  ${BLUE}AppImage:${NC}"
        find "$BUNDLE_DIR/appimage" -name "*.AppImage" -exec echo "    🐧 {}" \;
    fi
    
    # Windows
    if [ -d "$BUNDLE_DIR/msi" ]; then
        echo -e "  ${BLUE}Windows MSI:${NC}"
        find "$BUNDLE_DIR/msi" -name "*.msi" -exec echo "    🪟 {}" \;
    fi
    
    if [ -d "$BUNDLE_DIR/nsis" ]; then
        echo -e "  ${BLUE}Windows NSIS:${NC}"
        find "$BUNDLE_DIR/nsis" -name "*.exe" -exec echo "    🪟 {}" \;
    fi
    
    echo ""
fi

echo -e "${YELLOW}📋 Next steps for distribution:${NC}"
echo ""
echo "  1. Test the installer on a clean machine"
echo "  2. (Optional) Code sign the application for distribution"
echo "  3. Create release notes"
echo "  4. Distribute via GitHub Releases or your website"
echo ""

# For macOS, provide specific instructions
if [[ "$OSTYPE" == "darwin"* ]]; then
    DMG_PATH=$(find "$BUNDLE_DIR/dmg" -name "*.dmg" 2>/dev/null | head -1)
    if [ -n "$DMG_PATH" ]; then
        echo -e "${GREEN}🎉 Your macOS installer is ready:${NC}"
        echo "   $DMG_PATH"
        echo ""
        echo -e "${BLUE}To test locally:${NC}"
        echo "   open \"$DMG_PATH\""
        echo ""
    fi
fi
