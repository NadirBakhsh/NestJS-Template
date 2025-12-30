# MongoDB Configuration

This folder contains MongoDB database configuration and setup files for the NestJS application.

## Setup

1. Install required dependencies:
```bash
pnpm add @nestjs/mongoose mongoose
```

2. Configure MongoDB connection in your environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/your-database
```

## Usage

Import the MongooseModule in your app.module.ts or feature modules to connect to MongoDB and define your schemas.
