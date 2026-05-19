#!/bin/bash
set -e

cd /opt/placey

# Pull latest code
git pull origin main

# Start docker services
docker compose up -d

# Install dependencies
pnpm install --frozen-lockfile

# Build Nuxt app
pnpm build

# Restart the app via pm2 (creates it on first run, restarts on subsequent)
pm2 describe placey > /dev/null 2>&1 \
  && pm2 restart placey \
  || pm2 start .output/server/index.mjs \
       --name placey \
       --node-args="--env-file=/opt/placey/.env"

pm2 save
