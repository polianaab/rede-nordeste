# =============================================
# Stage 1 — BUILD (Maven + JDK 17)
# =============================================
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copia o pom.xml primeiro para aproveitar o cache de dependências do Docker.
# Se o pom.xml não mudar, o Docker reutiliza essa camada e não baixa tudo de novo.
COPY pom.xml .
RUN mvn dependency:go-offline -B --no-transfer-progress

# Copia o código-fonte e compila
COPY src ./src
RUN mvn package -DskipTests -B --no-transfer-progress

# =============================================
# Stage 2 — RUNTIME (JRE 17 Alpine — imagem menor)
# =============================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copia apenas o JAR gerado — sem Maven, sem código-fonte
COPY --from=builder /app/target/*.jar app.jar

# Railway injeta a porta via variável PORT.
# O application.properties já usa ${SERVER_PORT:8090},
# então a variável SERVER_PORT=${PORT} deve ser definida no painel do Railway.
EXPOSE 8080

# Inicia o Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
