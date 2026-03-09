#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  DEG EV Charging - Docker Setup${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker Desktop.${NC}"
    exit 1
fi

# Check if Docker daemon is running
if ! docker ps &> /dev/null; then
    echo -e "${RED}❌ Docker daemon is not running. Please start Docker Desktop.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed and running${NC}\n"

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker Compose is installed${NC}\n"

# Menu
echo -e "${BLUE}Choose an option:${NC}"
echo "1) Start all services (build + run)"
echo "2) Start services (without rebuild)"
echo "3) Stop all services"
echo "4) View logs"
echo "5) Restart services"
echo "6) Clean up (remove containers and data)"
echo "7) Check service status"
echo "8) Exit"
echo ""

read -p "Enter your choice (1-8): " choice

case $choice in
    1)
        echo -e "\n${YELLOW}Building and starting services...${NC}\n"
        docker-compose build
        docker-compose up -d
        echo -e "\n${GREEN}✓ Services started!${NC}"
        echo -e "${BLUE}Frontend: http://localhost:3000${NC}"
        echo -e "${BLUE}API: http://localhost:3001${NC}"
        echo -e "${BLUE}MongoDB: mongodb://admin:password@localhost:27017${NC}"
        echo -e "${BLUE}Redis: redis://localhost:6379${NC}"
        echo -e "\nWaiting for services to be healthy..."
        sleep 5
        docker-compose ps
        ;;
    2)
        echo -e "\n${YELLOW}Starting services...${NC}\n"
        docker-compose up -d
        echo -e "\n${GREEN}✓ Services started!${NC}"
        docker-compose ps
        ;;
    3)
        echo -e "\n${YELLOW}Stopping services...${NC}\n"
        docker-compose down
        echo -e "${GREEN}✓ Services stopped!${NC}"
        ;;
    4)
        echo -e "\n${YELLOW}Showing logs (press Ctrl+C to exit)...${NC}\n"
        docker-compose logs -f
        ;;
    5)
        echo -e "\n${YELLOW}Restarting services...${NC}\n"
        docker-compose restart
        echo -e "${GREEN}✓ Services restarted!${NC}"
        docker-compose ps
        ;;
    6)
        echo -e "\n${RED}Warning: This will remove all containers and data!${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo -e "\n${YELLOW}Cleaning up...${NC}\n"
            docker-compose down -v
            echo -e "${GREEN}✓ Cleanup complete!${NC}"
        else
            echo -e "${YELLOW}Cleanup cancelled${NC}"
        fi
        ;;
    7)
        echo -e "\n${BLUE}Service Status:${NC}\n"
        docker-compose ps
        ;;
    8)
        echo -e "${GREEN}Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice. Please try again.${NC}"
        exit 1
        ;;
esac
