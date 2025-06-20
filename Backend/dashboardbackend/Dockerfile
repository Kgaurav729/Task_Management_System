# # Importing JDK and copying required files
# FROM openjdk:19-jdk AS build
# WORKDIR /app
# COPY pom.xml .
# COPY src src

# # Copy Maven wrapper
# COPY mvnw .
# COPY .mvn .mvn

# # Set execution permission for the Maven wrapper
# RUN chmod +x ./mvnw
# RUN ./mvnw clean package -DskipTests

# # Stage 2: Create the final Docker image using OpenJDK 19
# FROM openjdk:19-jdk
# VOLUME /tmp

# # Copy the JAR from the build stage
# COPY --from=build /app/target/*.jar app.jar
# ENTRYPOINT ["java","-jar","/app.jar"]
# EXPOSE 8080


# Stage 1: Build the application using Java 21 and Maven Wrapper
FROM eclipse-temurin:21 AS build
WORKDIR /app

# Copy Maven wrapper and project files
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Give permission to execute the Maven wrapper
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
