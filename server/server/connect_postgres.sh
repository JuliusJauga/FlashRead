#!/bin/bash

if [ -z "$DB_PORT" ] || [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$SSH_USER" ] || [ -z "$SSH_HOST" ] || [ -z "$SSH_KEY" ]; then
  echo "Error: Missing required environment variables."
  exit 1
fi

chmod 600 "$SSH_KEY"

echo "Creating SSH tunnel..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -N -L "$DB_PORT:localhost:$DB_PORT" "$SSH_USER@$SSH_HOST" -p "$SSH_PORT" & 

SSH_PID=$!
echo "SSH tunnel established with PID: $SSH_PID"

sleep 2

echo "Connecting to PostgreSQL database..."
PGPASSWORD="$DB_PASSWORD" psql -h localhost -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"

echo "Killing SSH tunnel with PID: $SSH_PID"
kill "$SSH_PID"
