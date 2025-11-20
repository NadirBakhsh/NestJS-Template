import { NestFactory } from "@nestjs/core"

import { AppModule } from "./app.module"
import { setupSwagger } from "./swagger/swagger.config"
import { VersioningType } from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Setup global prefix
  app.setGlobalPrefix("api/")

  // Swagger Setup
  setupSwagger(app)

  const port = process.env.PORT ?? 5000
  await app.listen(port)

  console.log(`Application is running on: http://localhost:${port}`)
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`)

}

bootstrap().catch((error) => {
  console.error("Application failed to start:", error)
  process.exit(1)
})
