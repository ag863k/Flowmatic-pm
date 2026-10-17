# Flowmatic Backend Docker Deployment Script (PowerShell)
# This script builds and pushes the Docker image to Docker Hub

$ErrorActionPreference = "Stop"

# Configuration
$DOCKER_USERNAME = "ag9574"
$IMAGE_NAME = "flowmatic-backend"
$VERSION = "latest"

Write-Host "🚀 Starting Flowmatic Backend Docker Deployment" -ForegroundColor Green
Write-Host ""

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed. Please install Docker first." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
Set-Location backend

# Build the Docker image
docker build -t "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}" .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker image built successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

# Tag with commit SHA if in git repository
if (Test-Path .git) {
    $GIT_SHA = git rev-parse --short HEAD
    docker tag "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}" "${DOCKER_USERNAME}/${IMAGE_NAME}:${GIT_SHA}"
    Write-Host "✅ Tagged with Git SHA: ${GIT_SHA}" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔐 Logging in to Docker Hub..." -ForegroundColor Yellow
Write-Host "Please enter your Docker Hub credentials when prompted."

docker login

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Logged in to Docker Hub successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Docker Hub login failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "⬆️  Pushing Docker image to Docker Hub..." -ForegroundColor Yellow

docker push "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Image pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Docker push failed!" -ForegroundColor Red
    exit 1
}

# Push tagged version if exists
if ($GIT_SHA) {
    docker push "${DOCKER_USERNAME}/${IMAGE_NAME}:${GIT_SHA}"
    Write-Host "✅ Tagged version pushed: ${GIT_SHA}" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Docker image: ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
Write-Host ""
Write-Host "To pull and run:"
Write-Host "  docker pull ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
Write-Host "  docker run -d -p 10000:10000 --env-file .env ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
Write-Host ""
