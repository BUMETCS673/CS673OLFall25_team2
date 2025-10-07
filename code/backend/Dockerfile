# syntax=docker/dockerfile:1.7

# ---- Build stage ----
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /src

# Prime dependency cache
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn -q -B -ntp dependency:go-offline

# Build with tests
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -q -B -ntp package \
 && JAR="$(ls target/*.jar | grep -v 'original' | head -n1)" \
 && cp "$JAR" target/app.jar

# ---- Runtime image ----
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /src/target/app.jar /app/app.jar

EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=docker

# Run as non-root
RUN useradd -r -s /usr/sbin/nologin spring && chown -R spring:spring /app
USER spring

ENTRYPOINT ["java","-jar","/app/app.jar"]
