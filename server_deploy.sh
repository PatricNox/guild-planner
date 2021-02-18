#!/bin/sh
set -e

echo "Deploying..."

# Update bot
git fetch origin main
git reset --hard origin/main
npm install

# Restart bot
screen -S botprocess -X quit
screen -S botprocess -dm node index.js

echo "Application deployed!"
