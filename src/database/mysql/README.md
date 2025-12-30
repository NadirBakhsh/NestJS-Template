# MySQL Configuration

This folder contains MySQL database configuration and setup files for the NestJS application.

## Setup

1. Install required dependencies:
```bash
pnpm add @nestjs/typeorm typeorm mysql2
```

2. Configure MySQL connection in your environment variables:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your-password
DB_DATABASE=your-database
```

## Usage

Import the TypeOrmModule in your app.module.ts with MySQL configuration and define your entities.
