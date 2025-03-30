FROM node:23-alpine
WORKDIR /usr/src/app

COPY ./src ./src
COPY ./views ./views
COPY ./package.json .
COPY ./package-lock.json .

RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "dev"]