Bevor Sie beginnen, stellen Sie sicher, dass die Ports, die von Ihrer Anwendung und den dazugehörigen Services genutzt werden, auf Ihrem Host-System frei sind. Standardmäßig benötigt diese Anwendung:

Vue-Frontend: Port 80
Server-Backend: Port 3000

Prüfen Sie die Verfügbarkeit dieser Ports und stellen Sie sicher, dass keine anderen Anwendungen oder Dienste diese Ports belegen.

*****

Docker-Compose starten
Um Ihre Anwendung zu starten, navigieren Sie in Ihrem Terminal oder Ihrer Kommandozeile zum Root-Verzeichnis des Projekts, wo sich die docker-compose.yml-Datei befindet.

Führen Sie den folgenden Befehl aus, um die Docker-Container zu bauen und zu starten:
docker-compose up --build

*****

Öffnen Sie Ihren Browser und navigieren Sie zu http://localhost