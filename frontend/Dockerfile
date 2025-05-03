FROM node:23-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copia y prepara las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Establecer variables de entorno para la configuración de Vite
ARG VITE_BACKEND_API_URL
ENV VITE_BACKEND_API_URL=http://localhost:8000/

# Ejecutar el build de la aplicación
RUN npm run build

# Instalar dependencias de producción
FROM nginx:alpine

# Copia los archivos construidos al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia la configuración de Nginx personalizada para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto HTTP
EXPOSE 8080

# Ejecuta Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
