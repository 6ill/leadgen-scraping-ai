FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Default command (can be overridden in docker-compose.yml)
CMD ["npm", "run", "start:dev"]