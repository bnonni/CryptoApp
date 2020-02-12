FROM node:12

COPY package*.json ./

WORKDIR /usr/src/app

RUN yarn

COPY . .

EXPOSE 8081
CMD ["yarn test"]
CMD ["yarn dev"]