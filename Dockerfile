FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
ARG BUILD_VERSION=unknown
ENV BUILD_VERSION=$BUILD_VERSION
RUN pnpm build


FROM gcr.io/distroless/nodejs22-debian12

WORKDIR /app
COPY --from=builder /app/build ./build

EXPOSE 3000
ENV HOST=0.0.0.0 PORT=3000

CMD ["build"]
