# MongoDB Database Configuration

This folder contains MongoDB database configuration and setup files for the NestJS application using Mongoose.

## 📁 File Structure

- **`database.module.ts`** - Mongoose module configuration with async factory
- **`database.config.ts`** - Database configuration using NestJS ConfigService
- **`db.env.validation.ts`** - Environment variable validation schema using Joi

## 🚀 Setup

### 1. Install Dependencies

```bash
pnpm add @nestjs/mongoose mongoose
```

### 2. Install MongoDB Server

Choose one of the following options:

**Option A: Local Installation**

- **Windows**: Download from https://www.mongodb.com/try/download/community
- **macOS**: `brew install mongodb-community`
- **Linux**: Follow [official guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

**Option B: Docker**

```bash
docker run --name mongodb -p 27017:27017 -d mongo:latest
```

**Option C: MongoDB Atlas (Cloud)**

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string

### 3. Start MongoDB

**Local:**
```bash
# macOS/Linux
mongod --dbpath /path/to/data/directory

# Windows
mongod --dbpath C:\data\db

# Or if installed as service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

**Docker:**
```bash
docker start mongodb
```

### 4. Configure Environment Variables

Add to your `.env.development` file:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/nestjs-template

# For MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### 5. Enable MongoDB Module

In `src/configurations/app.config.module.ts`:

```typescript
import { MongoDBModule } from '../database/mongodb/database.module';
import mongodbEnvValidationSchema from '../database/mongodb/db.env.validation';
import mongodbConfig from '../database/mongodb/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [serverConfig, mongodbConfig],
      validationSchema: environmentSchema.concat(mongodbEnvValidationSchema),
    }),
    MongoDBModule,  // Add this
  ],
})
export class AppConfigurationModule {}
```

## ⚙️ Configuration Details

### Connection Settings

| Setting | Value | Description |
|---------|-------|-------------|
| `retryAttempts` | 3 | Number of connection retry attempts |
| `retryDelay` | 2000ms | Delay between retry attempts |
| `useNewUrlParser` | true | Use new connection string parser |
| `useUnifiedTopology` | true | Use new topology engine |

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | ❌ | mongodb://localhost:27017/nestjs-template | MongoDB connection URI |

### Connection URI Format

**Local MongoDB:**
```
mongodb://localhost:27017/database_name
```

**With Authentication:**
```
mongodb://username:password@localhost:27017/database_name
```

**MongoDB Atlas (Cloud):**
```
mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

**Replica Set:**
```
mongodb://host1:27017,host2:27017,host3:27017/database_name?replicaSet=myReplSet
```

## 📝 Usage Example

### Creating a Schema

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

### Using Schema in Service

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: any): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
```

### Registering Schema in Module

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

## 🔧 Common Issues & Solutions

### Issue 1: Connection Refused

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions**:
- Ensure MongoDB server is running: `mongod` or `brew services start mongodb-community`
- Check if port 27017 is available
- Verify MongoDB is listening on localhost

### Issue 2: Authentication Failed

**Error**: `MongoServerError: Authentication failed`

**Solutions**:
- Verify username and password in connection URI
- Ensure user has proper database permissions
- Check authentication database (usually `admin`)

### Issue 3: Database Not Found

MongoDB creates databases automatically when you insert data. No manual creation needed.

### Issue 4: Connection Timeout

**Error**: `MongooseServerSelectionError: connection timed out`

**Solutions**:
- Check network connectivity
- Verify firewall settings
- For MongoDB Atlas, add your IP to whitelist
- Increase `serverSelectionTimeoutMS` in connection options

## 🔐 Production Best Practices

1. **Use MongoDB Atlas** or managed MongoDB service
2. **Enable authentication** always in production
3. **Use SSL/TLS** for connections:
   ```
   mongodb://user:pass@host/db?ssl=true
   ```
4. **Implement connection pooling** (Mongoose handles this)
5. **Use indexes** for frequently queried fields
6. **Enable replica sets** for high availability
7. **Regular backups** using `mongodump` or Atlas backups
8. **Monitor performance** with MongoDB Compass or Atlas monitoring
9. **Limit connection pool size** appropriately
10. **Use environment-specific configurations**

## 🎯 Schema Design Tips

### Add Timestamps
```typescript
@Schema({ timestamps: true })
export class User {
  // createdAt and updatedAt added automatically
}
```

### Add Indexes
```typescript
@Schema()
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;
}
```

### Embedded Documents
```typescript
@Schema()
class Address {
  @Prop() street: string;
  @Prop() city: string;
}

@Schema()
export class User {
  @Prop({ type: Address })
  address: Address;
}
```

### References (Population)
```typescript
import { Types } from 'mongoose';

@Schema()
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: User;
}

// Usage
const posts = await this.postModel.find().populate('author').exec();
```

## 🛠️ Useful Commands

### MongoDB Shell Commands

```bash
# Connect to MongoDB
mongosh

# Show databases
show dbs

# Use database
use nestjs-template

# Show collections
show collections

# Find documents
db.users.find()

# Insert document
db.users.insertOne({ name: "John", email: "john@example.com" })

# Update document
db.users.updateOne({ email: "john@example.com" }, { $set: { name: "John Doe" } })

# Delete document
db.users.deleteOne({ email: "john@example.com" })

# Create index
db.users.createIndex({ email: 1 }, { unique: true })
```

### Backup & Restore

```bash
# Backup database
mongodump --db=nestjs-template --out=/backup/path

# Restore database
mongorestore --db=nestjs-template /backup/path/nestjs-template
```

## 📚 Additional Resources

- [NestJS Mongoose Documentation](https://docs.nestjs.com/techniques/mongodb)
- [Mongoose Official Documentation](https://mongoosejs.com/docs/guide.html)
- [MongoDB Official Documentation](https://docs.mongodb.com/)
- [MongoDB University (Free Courses)](https://university.mongodb.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

## 🔄 Migration from SQL

If migrating from SQL databases:

| SQL Concept | MongoDB Equivalent |
|------------|-------------------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| Primary Key | _id (auto-generated) |
| Foreign Key | Reference (ObjectId) |
| JOIN | $lookup or populate() |
| GROUP BY | Aggregation Pipeline |

## 🧪 Testing with MongoDB

Use MongoDB Memory Server for testing:

```bash
pnpm add -D @shelf/jest-mongodb
```

Configure in test files:
```typescript
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  const module = await Test.createTestingModule({
    imports: [MongooseModule.forRoot(uri)],
  }).compile();
});

afterAll(async () => {
  await mongod.stop();
});
```


