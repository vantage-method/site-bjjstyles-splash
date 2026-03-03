#!/bin/bash
# starts the dev server and any other services that are needed

cd "$(dirname "$0")/.."

echo "Starting Astro dev server..."
pnpm dev
