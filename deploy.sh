#!/bin/bash
set -e

# Load nvm so the webhook (non-login shell) gets the correct Node version
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd /opt/placey

# Pull latest code
git pull origin main

# Start minio services (skip db — managed separately)
docker compose up -d minio minio-init

# Install dependencies
pnpm install --frozen-lockfile

# Build Nuxt app
pnpm build

# Restart the app via pm2 (creates on first run, restarts on subsequent)
pm2 describe placey > /dev/null 2>&1 \
  && pm2 restart placey \
  || pm2 start .output/server/index.mjs \
       --name placey \
       --node-args="--env-file=/opt/placey/.env"

pm2 save
