# Sử dụng Node.js LTS
FROM node:18-alpine

# Set working dir trong container
WORKDIR /app

# Copy package trước (tận dụng cache)
COPY package*.json ./

# Cài dependencies
RUN npm install --production

# Copy toàn bộ source code
COPY . .

# Expose port 3000 cho app
EXPOSE 3000

# Start app
CMD ["node", "src/index.js"]
