FROM node:20-alpine3.16

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

RUN npm install bcrypt @types/bcrypt

RUN npm install -g ts-node-dev

COPY ./ ./

ENTRYPOINT ["npm","start"]