FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN chmod +x node_modules/.bin/vite

COPY . .

# Crear archivo .env con la URL del backend
RUN echo "VITE_API_URL=https://dinamicas-back-end-production.up.railway.app" > .env

RUN node node_modules/vite/bin/vite.js build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
