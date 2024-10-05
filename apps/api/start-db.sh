#!/bin/bash

export DB_CONTAINER_NAME=$(grep -v '^#' .env | grep '^DB_CONTAINER_NAME=' | cut -d '=' -f2- | tr -d '"')

if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
  echo "Container $DB_CONTAINER_NAME is already running."
else
  echo "Starting the container $DB_CONTAINER_NAME..."
  docker compose up -d db
fi
