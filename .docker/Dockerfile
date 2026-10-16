# Stage 1: Build
FROM node:22 AS builder

# Install pnpm
RUN npm install --global pnpm

WORKDIR /app

# Copy package files
COPY ./package*.json .npmrc pnpm-*.yaml ./
COPY ./packages/ ./packages/

# Install dependencies
RUN pnpm fetch
RUN pnpm install --prefer-offline

# Copy source files
COPY ./ .

# Build the application
RUN pnpm run build:all

# Stage 2: Production
FROM node:22-slim

# Install pnpm (needed for runtime)
RUN npm install --global pnpm

# Create app directory
WORKDIR /home/node/app
VOLUME /var/opt/media

# Copy built files from builder stage
COPY --from=builder --chown=node:node /app/package*.json /app/.npmrc /app/pnpm-*.yaml ./
COPY --from=builder --chown=node:node /app/packages ./packages

# Install only production dependencies
RUN pnpm install --prefer-offline --prod

CMD [ "pnpm", "run", "start:all"]
