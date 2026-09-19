FROM node:22-alpine
WORKDIR /usr/src/adr
COPY ./package* .
RUN npm ci
COPY . .
RUN npm install pm2 -g
CMD ["pm2-runtime", "server.js", "--no-daemon", "--name", "adr"]
