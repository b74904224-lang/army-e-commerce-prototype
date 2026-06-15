# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Install all deps (including dev) for the TypeScript build.
COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Install production dependencies only.
COPY package.json ./
RUN npm install --omit=dev

# Copy compiled output.
COPY --from=build /app/dist ./dist

# Run as the non-root node user.
USER node

EXPOSE 4000
CMD ["node", "dist/index.js"]
