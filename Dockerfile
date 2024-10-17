# Use the official Node.js 18 LTS image as the base image
FROM node:18.18.2-alpine3.18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./


# Copy the rest of the application code to the container
COPY . .

# Install dependencies
RUN yarn install

# Build the application based on the provided build target
ARG BUILD_TARGET
RUN yarn build:${BUILD_TARGET}


# Expose the port the application runs on (adjust if necessary)
EXPOSE 3000

# Start the application
CMD ["yarn", "workspace", "@beckn-ui/${BUILD_TARGET}", "start"]
