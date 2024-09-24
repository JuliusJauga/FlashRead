FROM node:20 AS build
WORKDIR /app

COPY . .
RUN npm install && npm run build

# Final image
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]