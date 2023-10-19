FROM node:latest

ARG MODE

ENV MODE=$MODE

WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . .
RUN npm run build-$MODE

CMD npx serve -s -l 5173 dist