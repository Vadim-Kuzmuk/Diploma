#!/bin/sh
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}==============================================="
echo -e	"==========${NC}STARTING REBUILD PROCESS${GREEN}============="
echo -e "===============================================${NC}"
echo -e ""

docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

docker-compose -f docker-compose.yaml -f docker-compose.local.yaml up --build -d

echo -e "${GREEN}==============================================="
echo -e "==================${NC}FINISHED!${GREEN}===================="
echo -e "===============================================${NC}"
