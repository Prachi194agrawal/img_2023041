FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production environment
ENV NODE_ENV=production
ENV REACT_APP_API_URL=http://ai-service:5000

EXPOSE 3000

CMD ["npm", "start"]
