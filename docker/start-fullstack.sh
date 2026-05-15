#!/bin/sh
set -e

# Java 固定 8080；Zeabur 注入的 PORT 只給 Nginx 對外監聽
export SERVER_PORT=8080

java -Dserver.port="${SERVER_PORT}" -jar /app/app.jar &

i=0
while [ "$i" -lt 45 ]; do
  if wget -q -O /dev/null "http://127.0.0.1:${SERVER_PORT}/api/health" 2>/dev/null; then
    break
  fi
  i=$((i + 1))
  sleep 2
done

envsubst '$PORT' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf
exec nginx -g 'daemon off;'
