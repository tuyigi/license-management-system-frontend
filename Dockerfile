# Step 1: Use Node.js to build the React app
FROM node:20 AS build

WORKDIR /app

# Copy only package.json and package-lock.json to avoid reinstalling dependencies unnecessarily
COPY package*.json ./

# Install dependencies with legacy peer dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Build the app
RUN npm run build

# Step 2: Serve the app directly with Node.js (no Nginx)
FROM node:20

WORKDIR /app

# Copy the build from the previous step
COPY --from=build /app/build /app/build

# Install serve to serve the build
RUN npm install -g serve

# Expose the port for React (3000)
EXPOSE 3000

# Serve the app
CMD ["serve", "-s", "build", "-l", "3000"]
