# Build stage
FROM --platform=$BUILDPLATFORM node:18-alpine AS builder

WORKDIR /app

# Enable Corepack and prepare Yarn 3.6.3
RUN corepack enable
RUN corepack prepare yarn@3.6.3 --activate

# Copy entire workspace first (needed for workspace resolution)
COPY . .

# Install dependencies
RUN yarn install

# Build the application
RUN yarn build:deg-ev-charging

# Verify the build was successful
RUN ls -la /app/apps/deg-ev-charging/.next/

# Production stage
FROM --platform=$TARGETPLATFORM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Enable Corepack and prepare Yarn 3.6.3
RUN corepack enable
RUN corepack prepare yarn@3.6.3 --activate

# Copy entire workspace (includes all built files)
COPY --from=builder /app .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the app
CMD ["yarn", "workspace", "@beckn-ui/deg-ev-charging", "start"]
