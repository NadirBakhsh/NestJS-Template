import * as Joi from 'joi';

const dbEnvValidationSchema = Joi.object({
    DATABASE_PORT: Joi.number().port().default(5432),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().allow('').default(''),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),
    DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
    DATABASE_AUTO_LOAD_ENTITIES: Joi.boolean().default(true),
});

export default dbEnvValidationSchema;