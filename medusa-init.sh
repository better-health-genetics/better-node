#!/bin/bash
set -e

# Terminal Colors
GREEN='\033[1;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔮 BETTY'S MEDUSA-CORE INITIALIZATION (CODESPACE EDITION)${NC}"
echo -e "${GREEN}=========================================================${NC}"
echo ""
echo "⚠️  DESTRUCTIVE OPERATIONS AHEAD"
echo "This script assumes you are ALREADY on the 'medusa-core' branch."
echo "This script will:"
echo "  1. Purge the bloated sample graveyard."
echo "  2. Install pristine dependencies (Express, GoogleAPIs, etc.)"
echo "  3. Scaffold the src/ directories."
echo "  4. Wire up package.json for ESM and TSX."
echo ""
read -p "Press ENTER to execute the purge, or Ctrl+C to abort: "

# Step 1: Nuke the samples
echo -e "${GREEN}Executing the Great Purge...${NC}"
rm -rf adminSDK apps-script calendar chat classroom docs drive forms gmail meet people sheets slides tasks solutions
echo -e "${GREEN}✅ Sample graveyard eradicated${NC}"

# Step 2: Install dependencies
echo -e "${GREEN}Fetching the Iron Backend dependencies...${NC}"
pnpm add express cors helmet winston dotenv googleapis
pnpm add -D @types/express @types/cors typescript tsx
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 3: Create src directory
mkdir -p src/services src/utils
echo -e "${GREEN}✅ Directory structure created${NC}"

# Step 4: Automate package.json scripts
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json'));
pkg.name = 'medusa-core';
pkg.version = '2.0.0';
pkg.scripts = {
  ...pkg.scripts,
  'dev': 'tsx watch src/server.ts',
  'build': 'tsc',
  'start': 'node dist/server.js'
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"
echo -e "${GREEN}✅ package.json scripts injected${NC}"

echo ""
echo -e "${GREEN}🚀 SCAFFOLDING COMPLETE. THE FORTRESS AWAITS.${NC}"
echo "Next steps:"
echo "  1. Create src/utils/logger.ts"
echo "  2. Create src/services/workspaceAuth.ts"
echo "  3. Create src/server.ts"
echo "  4. Run 'pnpm run dev' to ignite the core."
echo ""