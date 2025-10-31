import { Module } from '@nestjs/common';
import appConfig from './app.config';
import { ConfigModule } from '@nestjs/config/dist';
import environmentSchema from './environment.validation';

const ENV = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env.development' : `.env.${ENV}`,
      load: [appConfig],
      validationSchema: environmentSchema,
    }),
  ],
})
export class AppConfigurationModule {}
