FROM node:18 AS builder
WORKDIR /
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

#Server Configuration based on the servers we used

COPY --from=builder /dist /
EXPOSE 80

#Start the web server
