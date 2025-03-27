# Stage 1: Development
FROM node:18-alpine as development
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose development port
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]

# Stage 2: Build
FROM node:18-alpine as builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 3: Production
FROM nginx:alpine as production
COPY --from=builder /app/dist /usr/share/nginx/html

# Add nginx config
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
