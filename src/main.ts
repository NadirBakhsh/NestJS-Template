import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { setupSwagger } from "./swagger/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup global prefix
  app.setGlobalPrefix("api/v1");

  // Swagger Setup
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap().catch((error) => {
  console.error("Application failed to start:", error);
  process.exit(1);
});
