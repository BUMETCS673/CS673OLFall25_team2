# syntax=docker/dockerfile:1.7

# ---- Build stage ----
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy only the pom first to maximize dependency caching
COPY pom.xml .
# Cache the local Maven repo across builds
RUN --mount=type=cache,target=/root/.m2 mvn -q -B -DskipTests dependency:go-offline

# Now copy sources and build
COPY src ./src
# Skip compiling and running tests (fixes build errors from broken test sources)
CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.profiles=docker"]
RUN --mount=type=cache,target=/root/.m2 mvn test

# ---- Runtime image ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the fat jar produced by Spring Boot
# (Your jar currently builds as CareerForge-0.0.1-SNAPSHOT.jar; wildcard keeps it robust)
COPY --from=build /app/target/*.jar /app/app.jar

# Expose Spring Boot's port (application.properties has server.port=8080)
EXPOSE 8080

# Drop privileges
RUN useradd -ms /bin/bash spring && chown -R spring:spring /app
USER spring

ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=docker"]
