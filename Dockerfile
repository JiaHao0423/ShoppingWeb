# syntax=docker/dockerfile:1
# ShoppingWeb 後端 — Zeabur 部署（建置上下文：專案根目錄）
# 於 Zeabur 建立服務時，服務名稱建議設為 backend，或設定 ZBPACK_DOCKERFILE_NAME=backend 使用 Dockerfile.backend
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY backend/pom.xml .
COPY backend/.mvn .mvn
COPY backend/mvnw .
RUN chmod +x mvnw
RUN ./mvnw -B -q dependency:go-offline

COPY backend/src ./src
RUN ./mvnw -B -q package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=build /app/target/*.jar /app/app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
