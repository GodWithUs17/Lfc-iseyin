FROM node:18-alpine
WORKDIR /app

# Install only production dependencies (change if you want dev tools in image)
COPY package*.json ./
RUN npm ci --only=production

COPY . .
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "src/index.js"]
