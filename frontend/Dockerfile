# Stage 1: Build the app
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (only package.json + lockfile first for caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build Next.js for production
RUN npm run build

# Stage 2: Run the app
FROM node:24-alpine AS runner

WORKDIR /app

# Copy built output from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose Next.js port
EXPOSE 3000

# Run Next.js
CMD ["npm", "start"]
