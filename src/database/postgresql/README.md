# PostgreSQL Database Setup

This NestJS template comes with a pre-configured PostgreSQL database integration using TypeORM. Follow this guide to set up and use PostgreSQL in your application.

## 📋 Prerequisites

- PostgreSQL installed locally or access to a remote PostgreSQL instance
- Node.js and pnpm installed
- Basic understanding of TypeORM and NestJS

## 🚀 Quick Start

### 1. Install PostgreSQL

**Windows:**
```bash
# Download and install from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create a Database

Connect to PostgreSQL and create a database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE your_database_name;

# Create user (optional)
CREATE USER your_username WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_username;

# Exit
\q
```

### 3. Configure Environment Variables

Create a `.env.development` file in the root of your project with the following variables:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=your_database_name
DATABASE_SYNCHRONIZE=false
DATABASE_AUTO_LOAD_ENTITIES=true

# Application Configuration
NODE_ENV=development
```

> ⚠️ **Important:** Never set `DATABASE_SYNCHRONIZE=true` in production! This will automatically sync your schema and may cause data loss.

### 4. Install Required Dependencies

The following packages are required (should already be in package.json):

```bash
pnpm install @nestjs/typeorm typeorm pg
```

## 📁 Project Structure

```
src/database/postgresql/
├── database.module.ts          # TypeORM module configuration
├── database.config.ts          # Database configuration factory
├── db.env.validation.ts        # Environment variable validation schema
└── README.md                   # This file
```

## 🔧 Configuration Files

### database.module.ts
Main database module that initializes TypeORM with PostgreSQL:
- Uses async configuration with ConfigService
- Automatically loads entities from feature modules
- Initializes DataSource with custom factory
- Enables logging in development mode

### database.config.ts
Exports database configuration using `registerAs`:
- Namespace: `databaseCon`
- Provides typed configuration access
- Sets sensible defaults

### db.env.validation.ts
Joi validation schema for database environment variables:
- Validates required fields
- Sets default values
- Ensures type safety

## 🎯 Usage

### 1. Import DatabaseModule

The `DatabaseModule` is already imported in `AppConfigurationModule` and configured globally. To use TypeORM in your feature modules, import `TypeOrmModule.forFeature([YourEntity])` in your module's imports array.

### 2. Create Entities

Create entity classes in your feature modules using TypeORM decorators:
- Use `@Entity()` decorator to define database tables
- Define columns with `@Column()`, `@PrimaryGeneratedColumn()`, etc.
- Add relationships using `@OneToMany()`, `@ManyToOne()`, `@ManyToMany()`
- Include timestamps with `@CreateDateColumn()` and `@UpdateDateColumn()`

### 3. Use Repository Pattern

Inject repositories into your services using `@InjectRepository(YourEntity)` decorator. TypeORM provides a rich API for database operations:
- **CRUD Operations:** `find()`, `findOne()`, `save()`, `update()`, `delete()`
- **Query Builder:** Create complex queries with `createQueryBuilder()`
- **Relations:** Eager/lazy loading with `relations` option
- **Transactions:** Use `@Transaction()` decorator for atomic operations

## 🗃️ Migrations

TypeORM migrations allow you to manage database schema changes in a controlled and versioned manner. Migrations are essential for production environments where automatic synchronization is disabled.

### Setup TypeORM CLI

Create a `data-source.ts` configuration file in the root directory for TypeORM CLI to connect to your database and manage migrations.

### Migration Commands

Add the following scripts to your `package.json`:
- `migration:generate` - Auto-generate migration from entity changes
- `migration:run` - Execute pending migrations
- `migration:revert` - Rollback the last migration
- `migration:create` - Create a blank migration file

### Migration Workflow

1. **Create or modify entities** in your application
2. **Generate migration** to capture schema changes
3. **Review the generated migration** file
4. **Run migration** to apply changes to database
5. **Commit migration files** to version control

### Best Practices

- Always review auto-generated migrations before running
- Test migrations in development first
- Keep migrations small and focused
- Never modify migrations after they've been deployed
- Use descriptive names for migrations

## ⚙️ Advanced Configuration

### SSL Connection

For secure database connections, especially in production or cloud environments, enable SSL by uncommenting the SSL configuration in `database.module.ts`. Add `DATABASE_SSL=true` to your environment variables to activate encrypted connections.

### Connection Pooling

TypeORM automatically manages connection pooling with sensible defaults. You can customize pool settings like maximum connections, idle timeout, and connection timeout through additional TypeORM options in the database module configuration.

### Custom Repositories

Create custom repository classes to encapsulate complex database queries and business logic. Extend TypeORM's Repository class and inject DataSource to access advanced query capabilities, custom methods, and reusable database operations specific to your entities.

### Query Optimization

- Use **select** to fetch only required columns
- Implement **pagination** with `skip()` and `take()`
- Add **database indexes** on frequently queried columns
- Use **query builder** for complex joins and subqueries
- Enable **query caching** for read-heavy operations
- Leverage **lazy loading** for relations when appropriate

## 🔍 Testing Database Connection

Run your application:

```bash
pnpm run start:dev
```

You should see:
```
[Nest] INFO  - PostgreSQL DataSource has been initialized.
```

## 🐛 Common Issues

### Issue: "password authentication failed"
**Solution:** Double-check your `DATABASE_USER` and `DATABASE_PASSWORD` in `.env`

### Issue: "database does not exist"
**Solution:** Create the database using `CREATE DATABASE` command in PostgreSQL

### Issue: "SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"
**Solution:** Ensure environment variables are properly loaded and `DATABASE_PASSWORD` is a string

### Issue: "Connection refused"
**Solution:** 
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check if port 5432 is open
- Verify `DATABASE_HOST` and `DATABASE_PORT` in `.env`

### Issue: "relation does not exist"
**Solution:** 
- Run migrations: `pnpm run migration:run`
- Or temporarily set `DATABASE_SYNCHRONIZE=true` in development only

## 📚 Additional Resources

- [TypeORM Documentation](https://typeorm.io/)
- [NestJS TypeORM Integration](https://docs.nestjs.com/techniques/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeORM Migrations Guide](https://typeorm.io/migrations)

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong passwords** - Minimum 12 characters with mixed case, numbers, and symbols
3. **Disable synchronize in production** - Always use migrations
4. **Limit database user privileges** - Grant only necessary permissions
5. **Use connection pooling** - TypeORM handles this by default
6. **Enable SSL in production** - Encrypt data in transit
7. **Regular backups** - Set up automated database backups
8. **Use environment-specific configs** - Separate dev/staging/prod configurations

## 📝 Notes

- `autoLoadEntities: true` - Automatically loads entities from feature modules
- `synchronize: false` - Database schema is managed through migrations
- `logging: true` - Enabled only in development for debugging
- Connection pooling is enabled by default with sensible defaults

---

For questions or issues, please refer to the [NestJS Documentation](https://docs.nestjs.com) or [TypeORM Documentation](https://typeorm.io/).
