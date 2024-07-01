#!/bin/bash

# Defined Variables
REPO_URL="https://github.com/MInduagas/TicketSystemWebApi.git"
FRONTEND_REPO_URL="https://github.com/MrSpy60/sde-ticketing-system-frontend.git"
BRANCH="jwtImplemintation"
TARGET_DIR="/var/www/backend/TicketSystemWebApi"
FRONTEND_DIR="/var/www/frontend/TicketSystem"
CLONED_DIR="TicketSystemWebApi"
SEEDDATA_DIR="SeedData"
CLONEDSERVER_DIR="TicketSystemWebApi"
SERVER_NAME="progticket.webhotel-itskp.dk"
SERVER_USER="progticket"

# Update system
sudo apt-get -y update

# Stop and remove Apache
sudo service apache2 stop
sudo apt-get -y purge apache2 apache2-utils apache2-bin apache2.2-common
sudo apt-get -y autoremove

# Install Nginx
sudo apt-get -y update
sudo apt-get -y install nginx

# Allow Nginx HTTP / HTTPS
sudo ufw allow 'Nginx HTTPS'
sudo ufw status
systemctl status nginx

sudo bash -c 'echo "
server {
    listen 80 default_server;
    server_name '"$SERVER_NAME"';

    root /var/www/frontend;
    index index.html index.htm;

    location / {
        try_files \$uri \$uri/ =404;
    }

    # Redirect HTTP to HTTPS
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name '"$SERVER_NAME"';

    root /var/www/frontend;
    index index.html index.htm;

    ssl_certificate /etc/nginx/ssl/self-signed.crt;
    ssl_certificate_key /etc/nginx/ssl/self-signed.key;

    location / {
        try_files \$uri \$uri/ =404;
    }

    # Additional configuration for proxying API requests if needed
    # location /api {
    #     proxy_pass http://127.0.0.1:5000;
    #     proxy_http_version 1.1;
    #     proxy_set_header Upgrade \$http_upgrade;
    #     proxy_set_header Connection 'upgrade';
    #     proxy_set_header Host \$host;
    #     proxy_cache_bypass \$http_upgrade;
    #     proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
    #     proxy_set_header   X-Forwarded-Proto \$scheme;
    # }
}" > /etc/nginx/sites-available/default'

# Create SSL certificate for Nginx
sudo mkdir /etc/nginx/ssl
sudo openssl genrsa -out /etc/nginx/ssl/self-signed.key 2048
sudo openssl req -new -x509 -key /etc/nginx/ssl/self-signed.key -out /etc/nginx/ssl/self-signed.crt -days 365 -subj "/C=Dk/ST=FYN/L=ODENSE/O=NA/OU=NA/CN=NA/emailAddress=NA"
sudo openssl pkcs12 -export -out /etc/nginx/ssl/cert-file.pfx -inkey /etc/nginx/ssl/self-signed.key -in /etc/nginx/ssl/self-signed.crt -password pass:Admin123

# Install .NET
sudo apt-get -y update
sudo apt-get -y install -y dotnet-sdk-8.0
sudo apt-get -y update
sudo apt-get -y install -y aspnetcore-runtime-8.0

sudo bash -c 'echo "
Types: deb
URIs: https://packages.microsoft.com/ubuntu/22.04/prod/
Suites: jammy
Components: main
Architectures: amd64
Signed-By: /etc/apt/keyrings/microsoft.gpg
" > /etc/apt/sources.list.d/microsoft.sources'

# Install dotnet ef
dotnet tool install --global dotnet-ef

# Install PostgreSQL
sudo apt-get -y update
sudo apt-get -y install postgresql
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'Admin';"

# Clone frontend
mkdir /var/www/frontend
git clone -b server $FRONTED_REPO_URL /var/www/frontend/

# Clone backend and build the project
mkdir /var/www/backend
git clone -b $BRANCH $REPO_URL
sleep 2
cd $CLONED_DIR/$CLONEDSERVER_DIR
dotnet publish -c Release -r linux-x64 --self-contained true
cp -r bin/Release/net8.0/linux-x64/publish $TARGET_DIR

cd
cd $CLONED_DIR/$SEEDDATA_DIR
dotnet run

# Create a service for the project
sudo bash -c 'echo "
[Unit]
Description=Ticket System Web Api
After=network.target

[Service]
WorkingDirectory=/var/www/backend/TicketSystemWebApi
ExecStart=/usr/bin/dotnet /var/www/backend/TicketSystemWebApi/TicketSystemWebApi.dll
Restart=always
# Restart service after 10 seconds if the dotnet service crashes:
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=dotnet-ticket-system-web-api
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
" > /etc/systemd/system/ticket-system-web-api.service'

sudo chown $SERVER_USER:$SERVER_USER /etc/nginx/ssl/cert-file.pfx
sudo chmod 755 /etc/nginx/ssl/cert-file.pfx

# Start the service
sudo systemctl enable ticket-system-web-api.service
sudo systemctl start ticket-system-web-api.service

# Restart the server
sudo systemctl restart nginx
sudo systemctl restart ticket-system-web-api.service

# Reboot the server

sudo reboot