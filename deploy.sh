#!/bin/bash

# Server details
SERVER_IP="101.200.91.29"
SERVER_PORT="30077"
REMOTE_USER="root"
REMOTE_DIR="/var/www/html"
LOCAL_DIR="./dist/build/h5"

# Build the project
echo "Building the project..."
npm run build:h5

# Create remote directory if it doesn't exist
ssh -p $SERVER_PORT $REMOTE_USER@$SERVER_IP "mkdir -p $REMOTE_DIR"

# Copy files to server
echo "Copying files to server..."
scp -P $SERVER_PORT -r $LOCAL_DIR/* $REMOTE_USER@$SERVER_IP:$REMOTE_DIR/

# Set permissions
echo "Setting permissions..."
ssh -p $SERVER_PORT $REMOTE_USER@$SERVER_IP "chmod -R 755 $REMOTE_DIR"

echo "Deployment completed!" 