# MySQL Database Configuration

This folder contains MySQL database configuration and setup files for the NestJS application using TypeORM.

## 📁 File Structure

- **`database.module.ts`** - TypeORM module configuration with async factory
- **`database.config.ts`** - Database configuration using NestJS ConfigService
- **`db.env.validation.ts`** - Environment variable validation schema using Joi

## 🚀 Setup

### 1. Install Dependencies

```bash
ppnpm add @nestjs/typeorm typeorm mysql2
```

### 2. Install MySQL Server

Choose one of the following options:

- **XAMPP** (Windows/Mac/Linux): https://www.apachefriends.org/
- **WAMP** (Windows): https://www.wampserver.com/
- **MySQL Standalone**: https://dev.mysql.com/downloads/mysql/
- **Docker**: `docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8`

### 3. Configure Environment Variables

Create or update `.env.development` file in the project root:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=nestjs_template
DATABASE_SYNCHRONIZE=false
DATABASE_AUTO_LOAD_ENTITIES=true
```

### 4. Create Database

Connect to MySQL and create the database:

```sql
CREATE DATABASE nestjs_template CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or using command line:

```bash
mysql -u root -p -e "CREATE DATABASE nestjs_template CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 5. Enable Database Module

In `src/configurations/app.config.module.ts`, uncomment the DatabaseModule:

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({...}),
    DatabaseModule  // Uncomment this line
  ],
})
```

## ⚙️ Configuration Details

### Connection Settings

The database module includes the following connection settings:

| Setting | Value | Description |
|---------|-------|-------------|
| `retryAttempts` | 2 | Number of connection retry attempts |
| `retryDelay` | 2000ms | Delay between retry attempts |
| `connectTimeout` | 5000ms | Connection timeout duration |
| `autoLoadEntities` | true | Automatically load entities from feature modules |
| `synchronize` | false | **NEVER** set to true in production |
| `logging` | dev only | SQL query logging in development mode |

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_HOST` | ✅ | localhost | MySQL server host |
| `DATABASE_PORT` | ❌ | 3306 | MySQL server port |
| `DATABASE_USER` | ✅ | - | Database username |
| `DATABASE_PASSWORD` | ❌ | '' | Database password (can be empty for local dev) |
| `DATABASE_NAME` | ✅ | - | Database name |
| `DATABASE_SYNCHRONIZE` | ❌ | false | Auto-sync schema (use migrations instead) |
| `DATABASE_AUTO_LOAD_ENTITIES` | ❌ | true | Auto-load entities |

## 🔧 Common Issues & Solutions

### Issue 1: Access Denied Error

**Error**: `ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost'`

**Solutions**:
- Verify your MySQL password is correct in `.env.development`
- Try empty password: `DATABASE_PASSWORD=`
- Reset MySQL root password:
  ```bash
  mysqladmin -u root password newpassword
  ```

### Issue 2: Connection Timeout

**Error**: `connect ETIMEDOUT`

**Solutions**:
- Ensure MySQL server is running
- Check if port 3306 is open and not blocked by firewall
- Verify `DATABASE_HOST` and `DATABASE_PORT` are correct

### Issue 3: Database Not Found

**Error**: `ER_BAD_DB_ERROR: Unknown database`

**Solution**: Create the database first (see Setup step 4)

### Issue 4: Config Validation Error

**Error**: `Config validation error: "DATABASE_PASSWORD" is not allowed to be empty`

**Solutions**:
- Set a password in `.env.development`
- Or validation allows empty passwords (already configured)

## 📝 Usage Example

### Creating an Entity

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
```

### Using Repository in Service

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(user: Partial<User>): Promise<User> {
    return this.userRepository.save(user);
  }
}
```

### Registering Entity in Module

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

## 🔐 Production Best Practices

1. **Never use `synchronize: true`** in production - use migrations instead
2. **Use connection pooling** - TypeORM handles this automatically
3. **Enable SSL** for remote connections:
   ```typescript
   ssl: {
     rejectUnauthorized: false
   }
   ```
4. **Use environment-specific configurations**
5. **Implement proper error handling** and retry logic
6. **Monitor database connections** and query performance
7. **Use prepared statements** - TypeORM does this by default
8. **Keep credentials secure** - never commit `.env` files

## 📚 Additional Resources

- [TypeORM Documentation](https://typeorm.io/)
- [NestJS TypeORM Integration](https://docs.nestjs.com/techniques/database)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 🔄 Migration Guide

For production deployments, use TypeORM migrations instead of `synchronize`:

```bash
# Generate migration
pnpm run typeorm migration:generate -- -n MigrationName

# Run migrations
pnpm run typeorm migration:run

# Revert migration
pnpm run typeorm migration:revert
```
