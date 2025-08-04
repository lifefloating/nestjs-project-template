FROM oven/bun:1-alpine AS base

# 设置工作目录
WORKDIR /app

# 依赖安装层
FROM base AS dependencies
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile --production=false

# 构建层
FROM dependencies AS builder
COPY . .
RUN bun run prisma:generate
RUN bun run build

# 生产层
FROM oven/bun:1-alpine AS runner
ENV NODE_ENV=production

# 设置工作目录
WORKDIR /app

# 复制需要的文件
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bunfig.toml ./

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:7009/api/v1/health || exit 1

# 暴露端口
EXPOSE 7009

# 启动命令
CMD ["bun", "run", "start:prod"] 