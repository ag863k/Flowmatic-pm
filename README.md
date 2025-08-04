# Flowmatic - Project Management SaaS

A modern, full-stack SaaS application for team project management and collaboration. Built with React, Node.js, TypeScript, and MongoDB.

## Features

- Multi-workspace management with role-based permissions
- Project and task organization with real-time updates
- Team collaboration with invite system
- Multiple authentication methods (Email/Password and Google OAuth)
- Responsive design with dark/light theme support
- Secure JWT-based authentication
- RESTful API with comprehensive validation

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- TanStack Query for data fetching
- React Hook Form with Zod validation

**Backend:**
- Node.js with Express.js
- TypeScript for type safety
- MongoDB with Mongoose ODM
- JWT authentication
- Passport.js for OAuth

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6.0+
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/flowmatic.git
cd flowmatic
```

2. Install dependencies
```bash
npm install
```

3. Backend setup
```bash
cd backend
cp .env.example .env
# Configure your environment variables
npm install
```

4. Frontend setup
```bash
cd ../client
cp .env.example .env.local
# Configure your environment variables
npm install
```

5. Start development servers
```bash
# From root directory
npm run dev
```

This starts both frontend (http://localhost:5173) and backend (http://localhost:8000).

## Environment Variables

### Backend (.env)
```env
PORT=8000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_GOOGLE_CALLBACK_URL=http://localhost:5173/auth/google/callback
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both applications
- `npm run lint` - Lint both applications

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
flowmatic/
├── backend/          # Node.js/Express backend
│   ├── src/
│   │   ├── config/   # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── models/   # Database models
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic
│   │   └── utils/    # Utility functions
│   └── package.json
├── client/           # React frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── hooks/    # Custom hooks
│   │   ├── lib/      # Utilities
│   │   ├── page/     # Page components
│   │   └── types/    # TypeScript types
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/google` - Google OAuth

### Workspaces
- `GET /api/workspace/all` - Get user workspaces
- `POST /api/workspace/create/new` - Create workspace
- `PUT /api/workspace/update/:id` - Update workspace

### Projects
- `GET /api/project/workspace/:workspaceId` - Get projects
- `POST /api/project/workspace/:workspaceId/create` - Create project
- `PUT /api/project/:id/workspace/:workspaceId/update` - Update project

### Tasks
- `GET /api/task/workspace/:workspaceId` - Get tasks
- `POST /api/task/workspace/:workspaceId/create` - Create task
- `PUT /api/task/:id/workspace/:workspaceId/update` - Update task

## Deployment

### Frontend (Netlify)
1. Build: `cd client && npm run build`
2. Deploy the `dist` folder
3. Set environment variables in Netlify dashboard

### Backend (Railway/Render)
1. Set up MongoDB Atlas
2. Configure production environment variables
3. Deploy with build command: `npm run build`
4. Start command: `npm start`

## Security Features

- JWT token authentication with HTTP-only cookies
- Password hashing with bcrypt
- Input validation with Zod schemas
- CORS protection
- Environment variable management
- Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
- **Passport.js** - Authentication middleware
- **Zod** - Schema validation
- **bcrypt** - Password hashing

### Development Tools
- ESLint, Prettier, Husky, Concurrently

## Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/ag863k/flowmatic.git
cd flowmatic
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Configure your environment variables in .env
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Create environment file
cp .env.example .env.local
# Configure your environment variables
```

### 4. Database Setup
Make sure MongoDB is running and update the connection string in your backend `.env` file.

### 5. Start Development Servers
```bash
# From root directory
npm run dev
```

This will start both frontend (http://localhost:5173) and backend (http://localhost:8000) servers.

## Configuration

### Backend Environment Variables
```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/flowmatic

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# CORS
CLIENT_URL=http://localhost:5173
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## Project Structure

```
flowmatic/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── validation/     # Zod schemas
│   ├── package.json
│   └── tsconfig.json
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Libraries and utilities
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript types
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Deployment

### Frontend (Netlify)
1. Build the frontend: `cd client && npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Backend (Render/Railway/Heroku)
1. Set up MongoDB (Atlas recommended)
2. Configure production environment variables
3. Deploy backend to your chosen platform

### Environment Variables for Production
Update these for production:
- `CLIENT_URL` - Your frontend domain
- `MONGODB_URI` - Production database URL
- `JWT_SECRET` - Strong production secret

## Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both applications
- `npm run lint` - Lint both applications

### Backend
- `npm run dev` - Start development server
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with Zod schemas
- CORS protection
- Environment variable management

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Open a Pull Request

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/google` - Google OAuth

### Workspace Endpoints
- `GET /api/workspace/all` - Get user workspaces
- `POST /api/workspace/create/new` - Create workspace
- `PUT /api/workspace/update/:id` - Update workspace
- `DELETE /api/workspace/delete/:id` - Delete workspace

### Project Endpoints
- `GET /api/project/workspace/:workspaceId` - Get projects
- `POST /api/project/workspace/:workspaceId/create` - Create project
- `PUT /api/project/:id/workspace/:workspaceId/update` - Update project
- `DELETE /api/project/:id/workspace/:workspaceId/delete` - Delete project

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This is an open-source project. You are free to use, modify, and distribute this software under the terms of the MIT License.

