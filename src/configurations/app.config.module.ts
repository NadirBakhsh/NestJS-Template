import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import environmentSchema from "./environment.validation";
import serverConfig from "./server.config";

const ENV = process.env.NODE_ENV || "development";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? ".env.development" : `.env.${ENV}`,
      load: [serverConfig],
      validationSchema: environmentSchema,
    }),
  ],
})
export class AppConfigurationModule {}
