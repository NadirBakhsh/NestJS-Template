import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                type: 'mysql',
                host: config.get<string>('DATABASE_HOST'),
                port: config.get<number>('DATABASE_PORT'),
                username: config.get<string>('DATABASE_USER'),
                password: config.get<string>('DATABASE_PASSWORD'),
                database: config.get<string>('DATABASE_NAME'),

                // best practice
                autoLoadEntities: true, // loads entities from feature modules
                synchronize: false,     // NEVER true in production
                logging: config.get('NODE_ENV') === 'development',

                // ssl: config.get('DB_SSL') === 'true'
                //     ? { rejectUnauthorized: false }
                //     : false,
            }),
            dataSourceFactory: async (options) => {
                if (!options) {
                    throw new Error('DataSource options are required');
                }
                const { DataSource } = await import('typeorm');
                const dataSource = new DataSource(options);
                await dataSource.initialize();
                console.log('MySQL DataSource has been initialized.');
                return dataSource;
            },
        }),
    ],
})
export class DatabaseModule {}
