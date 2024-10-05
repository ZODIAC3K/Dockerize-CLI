
# Set the base image for the Express app
FROM node:20-alpine3.18

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files to the working directory
COPY . .

# Expose port 8000
EXPOSE 8000

# Command to run the app
CMD ["node", "index.js"]
