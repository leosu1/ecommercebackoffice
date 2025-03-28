FROM node:23-alpine
WORKDIR /usr/src/app

COPY ./src ./src
COPY ./views ./views
COPY ./package.json .
COPY ./package-lock.json .
COPY ./startup.sh .

RUN chmod 777 ./startup.sh
RUN npm ci

EXPOSE 3000

CMD ./startup.sh