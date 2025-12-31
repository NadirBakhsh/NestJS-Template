import { registerAs } from '@nestjs/config';

export default registerAs('mongodbCon', () => ({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nestjs-template',
    useNewUrlParser: true,
    useUnifiedTopology: true,
}));
