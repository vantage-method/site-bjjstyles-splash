#!/bin/bash
# Kills all dev services: Astro, Payload CMS, Postgres container

# Astro dev server (port 4321)
lsof -ti:4321 | xargs kill -9 2>/dev/null && echo "Killed Astro on port 4321" || echo "Nothing running on port 4321"

# Payload CMS (port 3000)
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "Killed Payload CMS on port 3000" || echo "Nothing running on port 3000"

# Postgres container
if docker ps --format '{{.Names}}' | grep -q "^bjjstyle-cms-postgres$"; then
  docker stop bjjstyle-cms-postgres > /dev/null && echo "Stopped Postgres container"
  docker rm bjjstyle-cms-postgres > /dev/null 2>&1
else
  echo "Postgres container not running"
fi
