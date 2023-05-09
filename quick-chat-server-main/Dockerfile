FROM node:20-alpine3.16

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY ./ ./

RUN npm run build

ENTRYPOINT ["npm","start"]