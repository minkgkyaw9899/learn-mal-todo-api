# Stage 1: Build
FROM oven/bun:alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache openssl

COPY package*.json ./
COPY bun.lock ./
COPY prisma ./prisma/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source and build (if using TypeScript)
COPY . .

# Expose the port your Express app listens on
EXPOSE 8000

CMD ["sh", "-c", "bun run db:deploy && bun run start"]