# 构建阶段
FROM node:lts-alpine AS builder

WORKDIR /app

# 复制依赖文件（这些更改频率较低，有利于缓存优化）
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# 禁用 Next.js 遥测
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=true

# 安装 pnpm（单独一层，以便缓存）
RUN npm install -g pnpm

# 安装依赖（利用缓存）
RUN pnpm install --frozen-lockfile

# 复制其余源代码（放在依赖安装后，因为代码变化更频繁）
COPY . .

# 构建应用
RUN pnpm run build

# 生产阶段 - 使用轻量级基础镜像
FROM builder AS production

WORKDIR /app

# 禁用 Next.js 遥测
ENV NEXT_TELEMETRY_DISABLED=1

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# 安装 pnpm 和仅生产环境依赖
RUN npm install -g pnpm && \
    pnpm install --prod --frozen-lockfile

# 从构建阶段复制构建产物
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 暴露默认的 Next.js 端口
EXPOSE 3000

# 启动命令
CMD ["pnpm", "run", "start"]
