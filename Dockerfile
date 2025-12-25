# Stage 1: Build
FROM oven/bun:alpine AS builder
WORKDIR /app

# Install build dependencies
COPY package*.json ./
COPY bun.lock ./
COPY prisma ./prisma/

# Install dependencies
RUN bun install --frozen-lockfile

# Generate Prisma Client
RUN bun db:generate

# Copy source and build (if using TypeScript)
COPY . .

# Stage 2: Run
FROM oven/bun:alpine AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy only what's needed from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
# ^ Change ./dist to your entry point directory

# Expose the port your Express app listens on
EXPOSE 5500

CMD ["bun", "src/index.js"]