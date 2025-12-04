FROM node:22-alpine

WORKDIR /app

# Install dependencies using lockfile
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of your code
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
