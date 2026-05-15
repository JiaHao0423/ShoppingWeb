# syntax=docker/dockerfile:1
# ShoppingWeb 全端（React + Spring Boot）— Zeabur 從 GitHub 部署預設使用此檔
# Nginx 對外監聽 $PORT，/api 轉發至同容器內 Java :8080

FROM eclipse-temurin:21-jdk-alpine AS backend-build
WORKDIR /app

COPY backend/pom.xml .
COPY backend/.mvn .mvn
COPY backend/mvnw .
RUN chmod +x mvnw
RUN ./mvnw -B -q dependency:go-offline

COPY backend/src ./src
RUN ./mvnw -B -q package -DskipTests

FROM node:22-alpine AS frontend-build
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ .

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN apk add --no-cache nginx gettext wget \
  && mkdir -p /var/lib/nginx /var/log/nginx /run/nginx /etc/nginx/http.d \
  && rm -f /etc/nginx/conf.d/default.conf /etc/nginx/http.d/default.conf 2>/dev/null || true \
  && chown -R nginx:nginx /var/lib/nginx /var/log/nginx /run/nginx

COPY --from=backend-build /app/target/*.jar /app/app.jar
COPY --from=frontend-build /app/dist /usr/share/nginx/html
COPY docker/nginx.fullstack.conf.template /etc/nginx/http.d/default.conf.template
COPY docker/start-fullstack.sh /start-fullstack.sh
RUN chmod +x /start-fullstack.sh \
  && sed -i 's/\r$//' /start-fullstack.sh

ENV PORT=8080
ENV SERVER_PORT=8080

EXPOSE 8080

CMD ["/start-fullstack.sh"]
