# Installation and Running Guide

## Prerequisites

- [Bun](https://bun.sh/) v1.0 or higher
- [MongoDB](https://www.mongodb.com/) server

> **Note:** For Node.js version (v20+) with pnpm (v8+), please check the [node-main branch](https://github.com/lifefloating/nestjs-project-template/tree/node-main)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
cp .env.sample .env
# Edit .env with your configuration
```

4. Generate Prisma client:

```bash
bun prisma:generate
```

5. Seed the database (optional):

```bash
bun db:seed
```

## Running the Application

Development mode:

```bash
bun start:dev
```

Production mode:

```bash
bun run build:nest
bun start:prod
```

## Code Quality

### Checking and fixing code:

```bash
# Check code quality and formatting
bun check

# Fix code quality and formatting issues automatically
bun check:fix

# Only check linting rules
bun lint

# Fix linting issues automatically
bun lint:fix
```

> **Note:** This project uses [Biome](https://biomejs.dev/) for code formatting and linting

### Formatting code:

```bash
bun format
```

## Testing

Running unit tests:

```bash
bun test
```

Running tests with coverage:

```bash
bun test:cov
```

Running tests in watch mode:

```bash
bun test:watch
```

## API Documentation

API documentation is available at `/apidoc` when the application is running. It provides an interactive interface to explore and test the API endpoints.

http://localhost:7009/apidoc#/