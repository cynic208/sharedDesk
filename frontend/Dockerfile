# Basis-Image
FROM node:16 as build-stage

# Arbeitsverzeichnis im Container festlegen
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package*.json ./
RUN npm install

# Vue-Projektdateien kopieren und bauen
COPY . .
RUN npm run build

# Nginx verwenden, um das gebaute Projekt zu servieren
FROM nginx:stable-alpine as production-stage

# Ersetze die Standard-Nginx-Konfigurationsdatei mit der benutzerdefinierten Datei
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
