import * as Joi from 'joi';

const mongodbEnvValidationSchema = Joi.object({
    MONGODB_URI: Joi.string()
        .uri()
        .default('mongodb://localhost:27017/nestjs-template')
        .description('MongoDB connection URI'),
});

export default mongodbEnvValidationSchema;
