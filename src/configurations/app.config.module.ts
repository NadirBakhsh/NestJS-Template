import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import environmentSchema from "./environment.validation";
import serverConfig from "./server.config";
import dbEnvValidationSchema from "src/database/postgresql/db.env.validation";
import databaseConfig from "src/database/postgresql/database.config";
import { DatabaseModule } from "src/database/postgresql/database.module";

const ENV = process.env.NODE_ENV || "development";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? ".env.development" : `.env.${ENV}`,
      load: [serverConfig, databaseConfig],
      validationSchema: environmentSchema.concat(dbEnvValidationSchema),
    }),
    DatabaseModule,
  ],
})
export class AppConfigurationModule {}
