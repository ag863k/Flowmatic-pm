# Flowmatic - Project Management SaaS

A modern, full-stack SaaS application for team project management and collaboration.

[![Build Status](https://github.com/ag863k/Flowmatic-pm/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/ag863k/Flowmatic-pm/actions)
[![Docker](https://img.shields.io/docker/v/ag9574/flowmatic-backend?label=Docker&logo=docker)](https://hub.docker.com/r/ag9574/flowmatic-backend)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Features

- Multi-workspace management with role-based permissions
- Project and task organization with real-time updates
- Team collaboration with invite system
- Multiple authentication methods: Email/Password and Google OAuth
- Responsive design with dark/light theme support
- Secure JWT-based authentication with HTTP-only cookies
- RESTful API with comprehensive validation

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- TanStack Query for data fetching
- React Hook Form with Zod validation
- Zustand for state management

**Backend:**
- Node.js with Express.js and TypeScript
- MongoDB with Mongoose ODM
- JWT authentication
- Passport.js for OAuth
- Docker for containerization
- Helmet and Compression middleware

**DevOps:**
- Docker Hub for backend container registry
- Netlify for frontend hosting
- GitHub Actions for CI/CD pipeline
- MongoDB Atlas for database hosting

## Quick Start

**Prerequisites:**
- Node.js 20 or higher
- Docker for backend deployment
- MongoDB local or Atlas
- Git

**Local Development:**

Clone the repository:
```bash
git clone https://github.com/ag863k/Flowmatic-pm.git
cd Flowmatic-pm
```

Backend Setup:
```bash
cd backend
npm install
cp .env.example .env
```

Configure backend .env file:
```env
PORT=10000
NODE_ENV=development
BASE_PATH=/api
MONGO_URI=mongodb://localhost:27017/flowmatic
SESSION_SECRET=your-session-secret-min-32-chars
JWT_SECRET=your-jwt-secret-min-32-chars
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:10000/api/auth/google/callback
FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_GOOGLE_CALLBACK_URL=http://localhost:5173/auth/google/callback
```

Start backend:
```bash
npm run dev
```

Frontend Setup:
```bash
cd ../client
npm install
cp .env.example .env.local
```

Configure frontend .env.local file:
```env
VITE_API_URL=http://localhost:10000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Start frontend:
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Docker Deployment

Build and run with Docker Compose:
```bash
docker-compose up -d
docker-compose ps
docker-compose logs -f
docker-compose down
```

Or use Docker directly:
```bash
cd backend
docker build -t flowmatic-backend .
docker run -d -p 10000:10000 --env-file .env --name flowmatic-backend flowmatic-backend
curl http://localhost:10000/health
```

Pull from Docker Hub:
```bash
docker pull ag9574/flowmatic-backend:latest
docker run -d -p 10000:10000 --env-file backend/.env --name flowmatic-backend ag9574/flowmatic-backend:latest
```

## Deployment Guide

**Backend Docker Deployment:**

Build and push to Docker Hub:
cd backend
docker build -t ag9574/flowmatic-backend:latest .
docker push ag9574/flowmatic-backend:latest
```

On your production server:
```bash
docker pull ag9574/flowmatic-backend:latest
docker run -d -p 10000:10000 \
  -e NODE_ENV=production \
  -e PORT=10000 \
  -e BASE_PATH=/api \
  -e MONGO_URI="your_mongodb_uri" \
  -e SESSION_SECRET="your_session_secret" \
  -e JWT_SECRET="your_jwt_secret" \
  -e GOOGLE_CLIENT_ID="your_client_id" \
  -e GOOGLE_CLIENT_SECRET="your_client_secret" \
  -e GOOGLE_CALLBACK_URL="https://your-backend.com/api/auth/google/callback" \
  -e FRONTEND_ORIGIN="https://your-netlify-app.netlify.app" \
  -e FRONTEND_GOOGLE_CALLBACK_URL="https://your-netlify-app.netlify.app/auth/google/callback" \
  --restart unless-stopped \
  --name flowmatic-backend \
  ag9574/flowmatic-backend:latest
```

Automated CI/CD with GitHub Actions:

The project includes automated Docker builds. To enable:

1. Add GitHub Secrets in repository settings:
   - DOCKER_USERNAME: Your Docker Hub username
   - DOCKER_PASSWORD: Your Docker Hub password/token

2. Push to main branch:
```bash
git add .
git commit -m "Update application"
git push origin main
```

GitHub Actions will automatically build, test, and push Docker image to Docker Hub.

**Frontend Netlify Deployment:**

1. Create Netlify account at netlify.com
2. Connect GitHub repository
3. Configure build settings:
   - Base directory: client
   - Build command: npm run build
   - Publish directory: client/dist
   - Branch: main

4. Add environment variables in Netlify:

```env
VITE_API_URL=https://your-backend-url.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

5. Deploy the site

6. Update backend CORS with Netlify URL:

```env
FRONTEND_ORIGIN=https://your-app.netlify.app
FRONTEND_GOOGLE_CALLBACK_URL=https://your-app.netlify.app/auth/google/callback
```

Restart backend container after updating environment variables.

**Google OAuth Setup:**

1. Go to Google Cloud Console: console.cloud.google.com
2. Create a new project
3. Enable Google+ API
4. Configure OAuth consent screen
5. Create OAuth 2.0 Client ID
6. Add Authorized JavaScript origins:
```
http://localhost:5173
https://your-netlify-app.netlify.app
```

7. Add Authorized redirect URIs:
```
http://localhost:10000/api/auth/google/callback
https://your-backend-url.com/api/auth/google/callback
```

8. Save and copy Client ID and Client Secret
9. Update environment variables in both backend and frontend

## Environment Variables

**Backend Required Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` / `development` |
| `PORT` | Server port | `10000` |
| `BASE_PATH` | API base path | `/api` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `SESSION_SECRET` | Session encryption key (min 32 chars) | `your-random-secret` |
| `JWT_SECRET` | JWT signing key (min 32 chars) | `your-random-secret` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | `GOCSPX-xxx` |
| `GOOGLE_CALLBACK_URL` | Backend OAuth callback | `https://backend.com/api/auth/google/callback` |
| `FRONTEND_ORIGIN` | Frontend URL for CORS | `https://app.netlify.app` |
| `FRONTEND_GOOGLE_CALLBACK_URL` | Frontend OAuth redirect | `https://app.netlify.app/auth/google/callback` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://backend.com/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |

### Generate Secure Secrets

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

## API Documentation

Base URL: http://localhost:10000/api

**Health Check:**
```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

**Authentication Endpoints:**

Register:
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Login:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Google OAuth:
```http
GET /api/auth/google
```

Logout:
```http
POST /api/auth/logout
Authorization: Bearer <jwt_token>
```

**Workspace Endpoints:**

```http
GET    /api/workspace/all
POST   /api/workspace/create/new
PUT    /api/workspace/update/:id
DELETE /api/workspace/delete/:id
```

**Project Endpoints:**

```http
GET    /api/project/workspace/:workspaceId
POST   /api/project/workspace/:workspaceId/create
PUT    /api/project/:id/workspace/:workspaceId/update
DELETE /api/project/:id/workspace/:workspaceId/delete
```

**Task Endpoints:**

```http
GET    /api/task/workspace/:workspaceId
POST   /api/task/workspace/:workspaceId/create
PUT    /api/task/:id/workspace/:workspaceId/update
DELETE /api/task/:id/workspace/:workspaceId/delete
```

## Project Structure

```
flowmatic/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── backend/
│   ├── src/
│   │   ├── @types/             # TypeScript type definitions
│   │   ├── config/             # Configuration files
│   │   │   ├── app.config.ts
│   │   │   ├── database.config.ts
│   │   │   ├── http.config.ts
│   │   │   └── passport.config.ts
│   │   ├── controllers/        # Route controllers
│   │   ├── enums/              # TypeScript enums
│   │   ├── middlewares/        # Express middlewares
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Utility functions
│   │   ├── validation/         # Zod validation schemas
│   │   └── index.ts            # Entry point
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── client/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities and helpers
│   │   ├── pages/              # Page components
│   │   ├── types/              # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   └── _redirects          # Netlify redirects
│   ├── .env.example
│   ├── netlify.toml
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── docker-compose.yml
├── .gitignore
├── LICENSE
└── README.md
```

## Security

Implemented security features:
- JWT authentication with secure token-based auth
- Password hashing with bcrypt
- HTTP-only cookies to prevent XSS attacks
- CORS protection for controlled cross-origin requests
- Helmet.js for security headers
- Input validation with Zod schemas
- Environment variables for sensitive data protection
- SQL injection protection via Mongoose ORM
- Docker security with non-root user

## Contributing

1. Fork the repository
2. Create a feature branch: git checkout -b feature/amazing-feature
3. Commit your changes: git commit -m 'Add some amazing feature'
4. Push to the branch: git push origin feature/amazing-feature
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Links

- GitHub Repository: https://github.com/ag863k/Flowmatic-pm.git
- Docker Hub: https://hub.docker.com/r/ag9574/flowmatic-backend

Built with passion by the Flowmatic Team
