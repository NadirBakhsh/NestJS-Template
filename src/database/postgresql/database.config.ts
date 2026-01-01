import { registerAs } from '@nestjs/config';

export default registerAs('databaseCon', () => ({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true' ? true : false,
    autoLoadEntities:
        process.env.DATABASE_AUTO_LOAD_ENTITIES === 'true' ? true : false,
}));