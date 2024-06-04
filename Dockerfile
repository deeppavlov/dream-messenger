FROM node:20.8.1 as messenger

ARG MODE

ENV MODE=$MODE

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build-$MODE

FROM nginx:1.25.4

COPY --from=messenger /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
