#!/bin/bash

# Exit in case of error
set -e

# Build and run containers
docker-compose up -d

# Hack to wait for postgres container to be up before running alembic migrations
sleep 5;

# Run migrations
docker-compose run --rm backend alembic upgrade 91979b40eb38
docker-compose run --rm backend alembic upgrade 9f0ac2920976
docker-compose run --rm backend alembic upgrade 7f148461880a
docker-compose run --rm backend alembic upgrade c2f783cbb79b
docker-compose run --rm backend alembic upgrade f4f9bceaaa7a

# Create initial data
docker-compose run --rm backend python3 app/initial_data.py