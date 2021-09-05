FROM node:latest as build-stage
LABEL stage=build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env* ./
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
