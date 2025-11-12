import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("My API Documentation")
    .setDescription("NestJS REST API documentation with Swagger")
    .setVersion("1.0")
    .addServer("http://localhost:5000", "Local environment")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep token between refreshes
      displayRequestDuration: true,
    },
    customCss: `
      .authorization__btn, .auth-wrapper { display: none !important; }
    `,
    customSiteTitle: "NestJS Swagger UI",
  });
}
