#!/bin/sh
set -e

export SERVER_PORT=8080

java -jar /app/app.jar &

envsubst '$PORT' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf
exec nginx -g 'daemon off;'
