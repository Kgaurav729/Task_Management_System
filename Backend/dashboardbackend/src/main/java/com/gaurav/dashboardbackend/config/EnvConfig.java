package com.gaurav.dashboardbackend.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {
    static {
        // Detect if running locally (Render sets an env var "RENDER")
        boolean isLocal = System.getenv("RENDER") == null;

        if (isLocal) {
            // Load from local .env file
            Dotenv dotenv = Dotenv.load();

            System.setProperty("DB_URL", dotenv.get("DB_URL"));
            System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
            System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
            System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
            System.setProperty("PORT", dotenv.get("PORT", "8080")); // default port fallback
            System.out.println("Loaded environment from .env file (LOCAL)");
        } else {
            // Load from system environment (Render, Docker)
//            System.setProperty("DB_URL", System.getenv("DB_URL"));
//            System.setProperty("DB_USERNAME", System.getenv("DB_USERNAME"));
//            System.setProperty("DB_PASSWORD", System.getenv("DB_PASSWORD"));
//            System.setProperty("JWT_SECRET", System.getenv("JWT_SECRET"));
//            System.setProperty("PORT", System.getenv("PORT") != null ? System.getenv("PORT") : "8080");
//            System.out.println("Loaded environment from system variables (PRODUCTION)");
        }
    }

//    static {
//        Dotenv dotenv = Dotenv.load();
//        System.setProperty("DB_URL", dotenv.get("DB_URL"));
//        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
//        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
//        System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
//        System.setProperty("PORT", dotenv.get("PORT"));
//    }


}
