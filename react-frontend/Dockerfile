FROM node:16-alpine

WORKDIR /srv

COPY . /srv

# Set npm to ignore engine strict
RUN npm config set engine-strict false

RUN npm install

RUN npm install -g serve

# Build the application
RUN npm run build

CMD ["serve", "-s", "build", "-l", "3000"]