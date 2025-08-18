# Prisma Migration and Seeding Setup

This document provides comprehensive guidance for using Prisma migrations and seeding in this NestJS project with MongoDB.

## Quick Start

### First Time Setup
```bash
# Setup everything: generate client, sync schema, and seed data
bun run db:setup
```

### Development Workflow
```bash
# 1. Make changes to prisma/schema.prisma
# 2. Sync changes to development database
bun run prisma:migrate:dev

# 3. Regenerate Prisma Client
bun run prisma:generate

# 4. Seed database with sample data
bun run db:seed
```

## Available Commands

### Migration Commands
| Command | Description | Environment |
|---------|-------------|-------------|
| `bun run prisma:migrate:dev` | Sync schema to database (development) | Development |
| `bun run prisma:migrate:deploy` | Deploy schema changes | Production |
| `bun run prisma:migrate:reset` | Reset database and migrations | Development |

### Database Management
| Command | Description |
|---------|-------------|
| `bun run db:seed` | Run database seeding |
| `bun run db:reset` | Reset database and reseed |
| `bun run db:setup` | Full setup (generate + deploy + seed) |

### Prisma Tools
| Command | Description |
|---------|-------------|
| `bun run prisma:generate` | Generate Prisma Client |
| `bun run prisma:studio` | Open Prisma Studio |

## 🌱 Seeding Options

### Basic Usage
```bash
# Standard seeding
bun run db:seed

# Only essential data (no test posts)
bun run db:seed -- --no-test-data

# Custom number of users and posts
bun run db:seed -- --users 5 --posts 10
```

### Environment Variables
```bash
# Custom admin password
ADMIN_PASSWORD=your_secure_password bun run db:seed

# Custom user password
USER_PASSWORD=user_secure_password bun run db:seed

# Clean database before seeding
SEED_CLEANUP=true bun run db:seed
```

## MongoDB Specific Notes

Unlike SQL databases, MongoDB doesn't require traditional migrations since it's schema-less. This project uses:

- **`prisma db push`** instead of `prisma migrate dev` for MongoDB
- **Schema validation** at the application level through Prisma
- **Flexible schema evolution** without breaking existing data

## 📁 Project Structure

```
prisma/
├── schema.prisma           # Database schema definition
├── seed.ts                # Enhanced seeding script
└── migrations/
    ├── README.md          # Migration documentation
    ├── dev-migrate.sh     # Development migration script
    └── prod-deploy.sh     # Production deployment script
```

## Production Deployment

### Using the deployment script:
```bash
# Deploy to production
./prisma/migrations/prod-deploy.sh

# Deploy without seeding
SKIP_SEED=true ./prisma/migrations/prod-deploy.sh
```

### Manual deployment:
```bash
NODE_ENV=production bun run prisma:migrate:deploy
bun run db:seed -- --no-test-data
```