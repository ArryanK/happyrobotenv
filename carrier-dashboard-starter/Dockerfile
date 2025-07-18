FROM node:20 AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all other files
COPY . .

# Build the React app (default to production)
RUN npm run build

# 2️⃣ Use a lightweight web server (nginx) for serving static files
FROM nginx:alpine

# Copy built assets from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (default for nginx)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
