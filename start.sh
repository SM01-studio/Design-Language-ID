#!/usr/bin/env bash
# Frontend startup script — works locally and on servers
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Install deps if missing
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
    echo ">>> node_modules not found, installing..."
    cd "$SCRIPT_DIR" && npm install
fi

echo ">>> Starting Next.js dev server..."
cd "$SCRIPT_DIR" && exec npx next dev
