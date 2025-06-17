# Flowmatic - Project Management SaaS

A full-stack SaaS application for team project management and task collaboration. Built with modern technologies for scalability and performance.

![Flowmatic](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)

## 🚀 Features

### Core Functionality
- **Multi-Workspace Management** - Create and manage multiple workspaces
- **Project Organization** - Organize work into projects with custom emojis
- **Task Management** - Create, assign, and track tasks with priorities and due dates
- **Team Collaboration** - Invite members with role-based permissions
- **Real-time Updates** - Live updates across team members
- **Mobile Responsive** - Fully optimized for mobile devices

### Authentication & Security
- **Multiple Auth Methods** - Email/password and Google OAuth
- **JWT-based Authentication** - Secure token-based sessions
- **Role-based Permissions** - Owner, Admin, and Member roles
- **Secure Invitations** - Invite-code based team joining

### User Experience
- **Modern UI/UX** - Clean, intuitive interface built with shadcn/ui
- **Dark/Light Mode** - Theme switching support
- **Responsive Design** - Mobile-first responsive layout
- **Accessibility** - WCAG compliant components

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling and validation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Passport.js** - Authentication middleware
- **Zod** - Schema validation
- **bcrypt** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Concurrently** - Run multiple commands

## 📦 Installation

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

## ⚙️ Configuration

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

## 🏗 Project Structure

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

## 🚀 Deployment

### Frontend (Netlify)
1. Build the frontend: `cd client && npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Backend (Render/Railway/Heroku)
1. Set up MongoDB (Atlas recommended)
2. Configure production environment variables
3. Deploy backend to your chosen platform

### Environment Variables for Production
Make sure to update:
- `CLIENT_URL` - Your frontend domain
- `MONGODB_URI` - Production database URL
- `JWT_SECRET` - Strong production secret
- Google OAuth credentials (if using)

## 🔧 Available Scripts

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

## 🔐 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Zod schema validation
- **CORS Protection** - Configured for specific origins
- **Rate Limiting** - API rate limiting (configurable)
- **Environment Variables** - Sensitive data protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Update documentation when needed
- Follow the existing code style

## 📝 API Documentation

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

### Task Endpoints
- `GET /api/task/workspace/:workspaceId` - Get tasks
- `POST /api/task/workspace/:workspaceId/create` - Create task
- `PUT /api/task/:id/workspace/:workspaceId/update` - Update task
- `DELETE /api/task/:id/workspace/:workspaceId/delete` - Delete task

## 🐛 Known Issues

- None currently reported

## 📋 Roadmap

- [ ] Real-time notifications
- [ ] File attachments for tasks
- [ ] Time tracking functionality
- [ ] Advanced reporting and analytics
- [ ] Team chat integration
- [ ] Calendar view for tasks
- [ ] Custom fields for tasks
- [ ] Webhook integrations

