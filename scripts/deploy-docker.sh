#!/bin/bash

# Flowmatic Backend Docker Deployment Script
# This script builds and pushes the Docker image to Docker Hub

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOCKER_USERNAME="ag9574"
IMAGE_NAME="flowmatic-backend"
VERSION="latest"

echo -e "${GREEN}Starting Flowmatic Backend Docker Deployment${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}ERROR: Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

echo -e "${YELLOW}Building Docker image...${NC}"
cd backend

# Build the Docker image
docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}SUCCESS: Docker image built successfully!${NC}"
else
    echo -e "${RED}ERROR: Docker build failed!${NC}"
    exit 1
fi

# Tag with commit SHA if in git repository
if git rev-parse --git-dir > /dev/null 2>&1; then
    GIT_SHA=$(git rev-parse --short HEAD)
    docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} ${DOCKER_USERNAME}/${IMAGE_NAME}:${GIT_SHA}
    echo -e "${GREEN}SUCCESS: Tagged with Git SHA: ${GIT_SHA}${NC}"
fi

echo ""
echo -e "${YELLOW}Logging in to Docker Hub...${NC}"
echo "Please enter your Docker Hub password when prompted."

docker login

if [ $? -eq 0 ]; then
    echo -e "${GREEN}SUCCESS: Logged in to Docker Hub successfully!${NC}"
else
    echo -e "${RED}ERROR: Docker Hub login failed!${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Pushing Docker image to Docker Hub...${NC}"

docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}SUCCESS: Image pushed successfully!${NC}"
else
    echo -e "${RED}ERROR: Docker push failed!${NC}"
    exit 1
fi

# Push tagged version if exists
if [ ! -z "$GIT_SHA" ]; then
    docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${GIT_SHA}
    echo -e "${GREEN}SUCCESS: Tagged version pushed: ${GIT_SHA}${NC}"
fi

echo ""
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo ""
echo "Docker image: ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
echo ""
echo "To pull and run:"
echo "  docker pull ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
echo "  docker run -d -p 10000:10000 --env-file .env ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
echo ""
