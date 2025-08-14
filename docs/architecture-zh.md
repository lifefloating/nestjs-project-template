# 项目架构

## 核心设计理念

- **模块化架构**: 每个功能模块独立，便于维护和扩展
- **配置驱动**: 通过环境变量和配置文件管理不同环境
- **统一接口**: 为云存储、认证等服务提供统一的抽象层
- **类型安全**: 全面使用 TypeScript 确保代码质量

## 目录结构

```
src/
├── app.module.ts          # 应用主模块
├── main.ts               # 应用入口
├── auth/                 # 认证模块 (Better Auth)
├── common/               # 通用组件
│   ├── decorators/       # 装饰器
│   ├── filters/          # 异常过滤器
│   ├── guards/           # 守卫
│   ├── interceptors/     # 拦截器
│   └── pipes/            # 管道
├── config/               # 配置管理
├── core/                 # 核心功能
│   ├── auth/             # 认证核心逻辑
│   └── database/         # 数据库核心
├── i18n/                 # 国际化
├── logger/               # 日志服务
├── mailer/               # 邮件服务
├── prisma/               # 数据库 ORM
├── storage/              # 云存储服务
├── stripe/               # 支付服务
└── users/                # 用户管理
```

## 核心模块

### 认证模块 (Auth)
- 使用 **Better Auth** 替代传统 JWT+Passport
- 支持多种 OAuth 提供商
- 统一的认证中间件和守卫

### 存储模块 (Storage)
- 支持 AWS S3、阿里云 OSS、腾讯云 COS
- 动态提供者加载，避免未配置服务的启动错误
- 统一的文件上传、下载、删除接口

### 配置模块 (Config)
- 环境特定配置 (development/production)
- 类型安全的配置接口
- Joi 验证确保配置正确性

### 通用模块 (Common)
- 全局异常过滤器
- 请求/响应拦截器
- 通用装饰器和工具

## 技术栈

- **Runtime**: Bun (替代 Node.js)
- **Framework**: NestJS + Fastify
- **Database**: MongoDB + Prisma ORM
- **Authentication**: Better Auth
- **Testing**: Bun 内置测试运行器
- **Linting**: Biome (替代 ESLint + Prettier)

## 数据流

```
Request → Middleware → Guards → Interceptors → Controller → Service → Database
                                     ↓
Response ← Filters ← Interceptors ← Controller ← Service ← Database
```

## 部署架构

- **开发环境**: 本地 Bun + Docker MongoDB
- **生产环境**: Docker Compose (应用 + MongoDB)
- **监控**: Datadog 集成 (可选)
- **文档**: Swagger/OpenAPI 自动生成
