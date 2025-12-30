# Supabase Configuration

This folder contains Supabase database configuration and setup files for the NestJS application.

## Setup

1. Install required dependencies:
```bash
pnpm add @supabase/supabase-js
```

2. Configure Supabase connection in your environment variables:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

## Usage

Create a Supabase service to interact with your Supabase backend and use it across your application modules.
