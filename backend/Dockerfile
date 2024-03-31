# Basis-Image
FROM node:16

# Arbeitsverzeichnis im Container festlegen
WORKDIR /usr/src/app

# Abhängigkeiten kopieren und installieren
COPY package*.json ./
RUN npm install

# Backend-Dateien kopieren
COPY . .

# Port freigeben und Server starten
EXPOSE 3000
CMD ["node", "server.js"]