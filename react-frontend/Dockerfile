FROM node:18-alpine

WORKDIR /srv

COPY . /srv

# Set npm to ignore engine strict
RUN npm config set engine-strict false

RUN npm install

RUN npm install -g serve

# Ensure the environment is set to production
ENV NODE_ENV=production

# Build the application
RUN npm run build --verbose

# Serve the application
CMD ["serve", "-s", "build"]
