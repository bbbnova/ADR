FROM node:23-alpine
WORKDIR /usr/src/adr
COPY ./package* .
RUN npm ci
COPY . .
RUN npm install pm2 -g
RUN pm2 list

CMD ["pm2-runtime", "server.js", "--no-daemon", "--name", "adr"]

