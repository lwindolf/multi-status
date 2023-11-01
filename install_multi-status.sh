#!/bin/bash

# Script created in part by ChatGPT (GPT-3.5)
# https://github.com/openai/gpt-3.5

# Original repository: https://github.com/lwindolf/multi-status
# Original author: Lars Windolf
# Contributing script author: Jeff (https://github.com/jeff89179)

# 1. Git clone https://github.com/lwindolf/multi-status.git into /
echo "Cloning multi-status repository..."
cd /
git clone https://github.com/lwindolf/multi-status.git

# 2. Install dependencies
echo "Installing dependencies..."
sudo apt-get update
sudo apt-get install -y libjson-perl libxml-feed-perl

# 3. Change directory to /multi-status/backend/
cd /multi-status/backend/

# 4. Run ./update.pl and wait for completion
echo "Running update.pl..."
./update.pl > /multi-status/frontend/data.json

# Wait until update.pl completes (you can specify a timeout)
while ! [ -f /multi-status/frontend/data.json ]
do
  sleep 1
done
echo "update.pl completed."

# 5. Change directory back to /multi-status
cd /multi-status

# 6. Create a symbolic link
echo "Creating symbolic link..."
ln -s frontend multi-status

# 7. Create, start, and enable the multi-status.service
echo "Creating, starting, and enabling multi-status.service..."
cat <<EOF | sudo tee /etc/systemd/system/multi-status.service
[Unit]
Description=Multi-Status Service
After=network.target

[Service]
ExecStart=/usr/bin/python3 -m http.server --directory /multi-status
WorkingDirectory=/multi-status
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
sudo systemctl daemon-reload

# Start and enable the service
sudo systemctl start multi-status
sudo systemctl enable multi-status

echo "multi-status.service is created, started, and enabled."
