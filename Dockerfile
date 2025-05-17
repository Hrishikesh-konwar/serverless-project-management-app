# Use official lightweight Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 8080 (required by Cloud Run)
EXPOSE 8080
ENV PORT=8080

# Start the Next.js app in production mode on port 8080
CMD ["npm", "start"]
