package com.spendwise.auth.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/**
 * SwaggerConfig - configures the Swagger/OpenAPI documentation UI.
 *
 * After starting the service, visit:
 * http://localhost:8081/swagger-ui.html
 *
 * You can test all endpoints directly from the browser.
 * Use the "Authorize" button to enter your JWT token for protected endpoints.
 */
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "SpendWise - Auth Service API",
        version = "1.0.0",
        description = "Authentication and User Management API for SpendWise Corporate Expense System",
        contact = @Contact(name = "SpendWise Team", email = "admin@spendwise.com")
    )
)
@SecurityScheme(
    name = "bearerAuth",                    // Name used in @SecurityRequirement annotations
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",                   // Just a hint for Swagger UI
    in = SecuritySchemeIn.HEADER
)
public class SwaggerConfig {
    // Configuration is done through annotations above
}
