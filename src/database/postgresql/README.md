# PostgreSQL Configuration

This folder contains PostgreSQL database configuration and setup files for the NestJS application.

## Setup

1. Install required dependencies:
```bash
pnpm add @nestjs/typeorm typeorm pg
```

2. Configure PostgreSQL connection in your environment variables:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-password
DB_DATABASE=your-database
```

## Usage

Import the TypeOrmModule in your app.module.ts with PostgreSQL configuration and define your entities.
