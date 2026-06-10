set -e

npm run build

redis-server &
REDIS_PID=$!

trap 'kill "$REDIS_PID" 2>/dev/null || true' EXIT INT TERM

npm run start:dev