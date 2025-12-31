import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import environmentSchema from "./environment.validation";
import serverConfig from "./server.config";
import mongodbEnvValidationSchema from "src/database/mongodb/db.env.validation";
import { MongoDBModule } from "src/database/mongodb/database.module";

const ENV = process.env.NODE_ENV || "development";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? ".env.development" : `.env.${ENV}`,
      load: [serverConfig],
      validationSchema: environmentSchema.concat(mongodbEnvValidationSchema),
    }),
    MongoDBModule,
  ],
})
export class AppConfigurationModule {}
