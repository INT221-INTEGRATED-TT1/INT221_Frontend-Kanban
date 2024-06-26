FROM node:20 AS builder
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build
EXPOSE 1449

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 1449
