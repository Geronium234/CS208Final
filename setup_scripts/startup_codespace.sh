#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"

if lsof -ti tcp:"$PORT" >/dev/null 2>&1; then
  echo "Port $PORT is already in use. Stopping existing process..."
  lsof -ti tcp:"$PORT" | xargs -r kill -9

  if lsof -ti tcp:"$PORT" >/dev/null 2>&1; then
    echo "Could not free port $PORT. Please run: lsof -i :$PORT -P -n"
    exit 1
  fi
fi

echo "Starting MariaDB service..."
# MariaDB may be stopped after a Codespace restart.
sudo service mariadb start >/dev/null 2>&1 || true

echo "Starting web app on port $PORT..."
npm start
#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"

if lsof -ti tcp:"$PORT" >/dev/null 2>&1; then
  echo "Port $PORT is already in use. Stopping existing process..."
  lsof -ti tcp:"$PORT" | xargs -r kill
fi

echo "Starting MariaDB service..."
# MariaDB may be stopped after a Codespace restart.
sudo service mariadb start >/dev/null 2>&1 || true

echo "Starting web app on port $PORT..."
npm start
