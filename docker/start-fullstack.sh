#!/bin/sh
set -e

# Zeabur 的 PORT（通常 8080）給 Nginx；Java 用另一個埠避免 bind 衝突
BACKEND_PORT="${BACKEND_PORT:-8081}"
export BACKEND_PORT

java -Dserver.port="${BACKEND_PORT}" -jar /app/app.jar &

i=0
while [ "$i" -lt 45 ]; do
  if wget -q -O /dev/null "http://127.0.0.1:${BACKEND_PORT}/api/health" 2>/dev/null; then
    break
  fi
  i=$((i + 1))
  sleep 2
done

envsubst '$PORT $BACKEND_PORT' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf
exec nginx -g 'daemon off;'
