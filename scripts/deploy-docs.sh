#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check required environment variables
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "Error: CLOUDFLARE_API_TOKEN not set"
  exit 1
fi

if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
  echo "Error: CLOUDFLARE_ACCOUNT_ID not set"
  exit 1
fi

if [ -z "$CLOUDFLARE_PROJECT_NAME" ]; then
  echo "Error: CLOUDFLARE_PROJECT_NAME not set"
  exit 1
fi

echo "Building documentation site..."
pnpm --filter @ts-contract/docs build

if [ ! -d "apps/docs/out" ]; then
  echo "Error: Build output directory apps/docs/out does not exist"
  exit 1
fi

echo "Deploying to Cloudflare Pages..."
echo "Project: $CLOUDFLARE_PROJECT_NAME"

# Use local wrangler installation
pnpm exec wrangler pages deploy apps/docs/out \
  --project-name="$CLOUDFLARE_PROJECT_NAME" \
  --branch=main

echo "Deployment complete!"
