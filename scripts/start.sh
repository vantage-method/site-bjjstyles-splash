#!/bin/bash
# Starts all dev services: Postgres (Docker), Payload CMS, Astro site

set -e
cd "$(dirname "$0")/.."

SCRIPT_DIR="$(pwd)/scripts"
CMS_DIR="$(pwd)/../site-jiu-jitsu-style-cms"
POSTGRES_CONTAINER="bjjstyle-cms-postgres"
POSTGRES_PORT=5433
POSTGRES_PASSWORD="bjjstyle-dev"
DATABASE_URL="postgresql://postgres:${POSTGRES_PASSWORD}@127.0.0.1:${POSTGRES_PORT}/bjjstyle-cms"

# --- Postgres ---
if docker ps --format '{{.Names}}' | grep -q "^${POSTGRES_CONTAINER}$"; then
  echo "Postgres already running on port ${POSTGRES_PORT}"
else
  # Remove stopped container if it exists
  docker rm -f "$POSTGRES_CONTAINER" 2>/dev/null || true

  echo "Starting Postgres on port ${POSTGRES_PORT}..."
  docker run -d \
    --name "$POSTGRES_CONTAINER" \
    -e POSTGRES_DB=bjjstyle-cms \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
    -p "${POSTGRES_PORT}:5432" \
    postgres:16-alpine \
    > /dev/null

  # Wait for Postgres to be ready
  echo -n "Waiting for Postgres..."
  for i in $(seq 1 30); do
    if docker exec "$POSTGRES_CONTAINER" pg_isready -U postgres -q 2>/dev/null; then
      echo " ready"
      break
    fi
    echo -n "."
    sleep 1
  done
fi

# --- Payload CMS ---
echo "Starting Payload CMS on port 3000..."

# Write .env for the CMS
cat > "${CMS_DIR}/.env" <<EOF
DATABASE_URL=${DATABASE_URL}
PAYLOAD_SECRET=dev-secret-local-only-change-in-prod
EOF

# Run migrations (creates/updates tables)
echo "Running Payload migrations..."
(cd "$CMS_DIR" && npx payload migrate 2>&1 | grep -E "INFO|ERROR|Migrat")

(cd "$CMS_DIR" && pnpm dev) &
CMS_PID=$!

# Wait for CMS to be ready
echo -n "Waiting for Payload CMS..."
for i in $(seq 1 60); do
  if curl -s -o /dev/null -w '' http://localhost:3000/api 2>/dev/null; then
    echo " ready"
    break
  fi
  echo -n "."
  sleep 2
done

# --- Astro ---
echo "Starting Astro dev server on port 4321..."
pnpm dev &
ASTRO_PID=$!

echo ""
echo "All services running:"
echo "  Postgres:    localhost:${POSTGRES_PORT}"
echo "  Payload CMS: http://localhost:3000/admin"
echo "  Astro:       http://localhost:4321"
echo ""
echo "Use scripts/kill.sh to stop everything."

# Wait for any child to exit
wait
