import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppConfigurationModule } from "./configurations/app.config.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [AppConfigurationModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
