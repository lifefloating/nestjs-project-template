# Project Architecture

## Core Design Principles

- **Modular Architecture**: Each functional module is independent for easy maintenance and extension
- **Configuration-Driven**: Manage different environments through environment variables and configuration files
- **Unified Interface**: Provide unified abstraction layer for cloud storage, authentication and other services
- **Type Safety**: Comprehensive use of TypeScript to ensure code quality

## Directory Structure

```
src/
├── app.module.ts          # Main application module
├── main.ts               # Application entry point
├── auth/                 # Authentication module (Better Auth)
├── common/               # Common components
│   ├── decorators/       # Decorators
│   ├── filters/          # Exception filters
│   ├── guards/           # Guards
│   ├── interceptors/     # Interceptors
│   └── pipes/            # Pipes
├── config/               # Configuration management
├── core/                 # Core functionality
│   ├── auth/             # Authentication core logic
│   └── database/         # Database core
├── i18n/                 # Internationalization
├── logger/               # Logging service
├── mailer/               # Email service
├── prisma/               # Database ORM
├── storage/              # Cloud storage service
├── stripe/               # Payment service
└── users/                # User management
```

## Core Modules

### Authentication Module (Auth)
- Uses **Better Auth** instead of traditional JWT+Passport
- Supports multiple OAuth providers
- Unified authentication middleware and guards

### Storage Module (Storage)
- Supports AWS S3, Alibaba Cloud OSS, Tencent Cloud COS
- Dynamic provider loading to avoid startup errors for unconfigured services
- Unified file upload, download, and delete interfaces

### Configuration Module (Config)
- Environment-specific configuration (development/production)
- Type-safe configuration interfaces
- Joi validation ensures configuration correctness

### Common Module (Common)
- Global exception filters
- Request/response interceptors
- Common decorators and utilities

## Tech Stack

- **Runtime**: Bun (replaces Node.js)
- **Framework**: NestJS + Fastify
- **Database**: MongoDB + Prisma ORM
- **Authentication**: Better Auth
- **Testing**: Bun built-in test runner
- **Linting**: Biome (replaces ESLint + Prettier)

## Data Flow

```
Request → Middleware → Guards → Interceptors → Controller → Service → Database
                                     ↓
Response ← Filters ← Interceptors ← Controller ← Service ← Database
```

## Deployment Architecture

- **Development**: Local Bun + Docker MongoDB
- **Production**: Docker Compose (Application + MongoDB)
- **Monitoring**: Datadog integration (optional)
- **Documentation**: Swagger/OpenAPI auto-generation
