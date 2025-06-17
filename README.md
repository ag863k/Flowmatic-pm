# 🌊 Flowmatic - Modern Project Management SaaS

<div align="center">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License">
  <img src="https://img.shields.io/badge/Node.js-18+-green" alt="Node.js">
  <img src="https://img.shields.io/badge/React-18+-blue" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.0+-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/MongoDB-6.0+-green" alt="MongoDB">
</div>

<br>

A powerful, full-stack SaaS application for modern team project management and collaboration. Built with cutting-edge technologies and designed for scalability, security, and exceptional user experience.

## ✨ Key Features

### 🔐 **Flexible Authentication**
- **Multiple Login Methods**: Email/password and Google OAuth seamlessly integrated
- **Account Linking**: Users can add multiple authentication methods to the same account
- **JWT Security**: Secure token-based authentication with httpOnly cookies
- **Cross-Platform**: Works perfectly across all devices and browsers

### 🏢 **Multi-Workspace Management**
- **Unlimited Workspaces**: Create and manage multiple team environments
- **Role-Based Access**: Owner, Admin, and Member permissions
- **Team Invitations**: Secure invite-code based team joining
- **Workspace Switching**: Seamlessly switch between different workspaces

### 📊 **Advanced Project & Task Management**
- **Project Organization**: Organize work with custom emoji-enabled projects
- **Smart Task System**: Create, assign, and track tasks with priorities and due dates
- **Real-time Updates**: Live synchronization across all team members
- **Progress Tracking**: Visual progress indicators and status management

### 🎨 **Modern User Experience**
- **Responsive Design**: Mobile-first, fully responsive across all devices
- **Dark/Light Themes**: Elegant theme system with gradient backgrounds
- **Accessibility**: WCAG compliant components and keyboard navigation
- **Intuitive Interface**: Clean, modern UI built with shadcn/ui components

### 🔧 **Developer-Friendly**
- **Type Safety**: Full TypeScript implementation on both frontend and backend
- **Production Ready**: Comprehensive error handling and security measures
- **Scalable Architecture**: Modular design with clean separation of concerns
- **Comprehensive Testing**: Robust validation and error handling

## 🛠 **Technology Stack**

### **Frontend**
```
React 18           - Modern React with hooks and context
TypeScript         - Type-safe development
Vite              - Lightning-fast build tool and dev server
Tailwind CSS      - Utility-first CSS framework
shadcn/ui         - High-quality UI component library
React Router v6   - Modern client-side routing
TanStack Query    - Powerful data fetching and caching
React Hook Form   - Performant form handling
Zod               - TypeScript-first schema validation
Axios             - HTTP client with interceptors
```

### **Backend**
```
Node.js           - JavaScript runtime
Express.js        - Minimal web framework
TypeScript        - Type-safe backend development
MongoDB           - NoSQL document database
Mongoose          - MongoDB object modeling
JWT               - JSON Web Tokens for authentication
Passport.js       - Authentication middleware
bcrypt            - Password hashing
Zod               - Schema validation
Cookie Parser     - Cookie handling middleware
CORS              - Cross-Origin Resource Sharing
```

### **Development Tools**
```
ESLint            - Code linting and style enforcement
Prettier          - Code formatting
Husky             - Git hooks for quality control
Concurrently      - Run multiple commands simultaneously
Nodemon           - Development server auto-restart
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18.0 or higher
- MongoDB 6.0 or higher (local installation or cloud service)
- Git for version control

### **1. Clone & Install**
```bash
# Clone the repository
git clone https://github.com/yourusername/flowmatic.git
cd flowmatic

# Install dependencies for both frontend and backend
npm install
```

### **2. Environment Setup**

#### **Backend Configuration**
```bash
cd backend
cp .env.example .env
```

Configure your `backend/.env`:
```env
# Server Configuration
PORT=8000
NODE_ENV=development
BASE_PATH=/api

# Database
MONGODB_URI=mongodb://localhost:27017/flowmatic

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
SESSION_SECRET=your-session-secret-key-here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URLs
CLIENT_URL=http://localhost:5173
FRONTEND_GOOGLE_CALLBACK_URL=http://localhost:5173/auth/google/callback
```

#### **Frontend Configuration**
```bash
cd ../client
cp .env.example .env.local
```

Configure your `client/.env.local`:
```env
# API Configuration
VITE_API_URL=http://localhost:8000/api
VITE_API_BASE_URL=http://localhost:8000/api

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### **3. Database Setup**
Ensure MongoDB is running:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend/.env with your Atlas connection string
```

### **4. Start Development**
```bash
# From the root directory
npm run dev
```

This starts:
- Backend server: `http://localhost:8000`
- Frontend app: `http://localhost:5173`

### **5. Initial Setup**
1. Open `http://localhost:5173`
2. Sign up with email/password or Google OAuth
3. Create your first workspace
4. Start creating projects and tasks!

## 📁 **Project Structure**

```
flowmatic/
├── 📁 backend/                    # Node.js/Express backend
│   ├── 📁 src/
│   │   ├── 📁 @types/            # TypeScript type definitions
│   │   ├── 📁 config/            # Configuration files
│   │   │   ├── app.config.ts     # App configuration
│   │   │   ├── database.config.ts # Database connection
│   │   │   ├── http.config.ts    # HTTP status codes
│   │   │   └── passport.config.ts # Google OAuth config
│   │   ├── 📁 controllers/       # Route controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── workspace.controller.ts
│   │   │   ├── project.controller.ts
│   │   │   └── task.controller.ts
│   │   ├── 📁 middlewares/       # Custom middlewares
│   │   │   ├── asyncHandler.middleware.ts
│   │   │   ├── errorHandler.middleware.ts
│   │   │   ├── isAuthenticated.middleware.ts
│   │   │   └── isAuthenticatedJWT.middleware.ts
│   │   ├── 📁 models/            # Mongoose models
│   │   │   ├── user.model.ts
│   │   │   ├── account.model.ts
│   │   │   ├── workspace.model.ts
│   │   │   ├── project.model.ts
│   │   │   ├── task.model.ts
│   │   │   └── member.model.ts
│   │   ├── 📁 routes/            # API routes
│   │   ├── 📁 services/          # Business logic layer
│   │   ├── 📁 utils/             # Utility functions
│   │   ├── 📁 validation/        # Zod validation schemas
│   │   └── index.ts              # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── 📁 client/                     # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/        # Reusable UI components
│   │   │   ├── 📁 ui/            # Base UI components (shadcn/ui)
│   │   │   ├── 📁 auth/          # Authentication components
│   │   │   ├── 📁 workspace/     # Workspace-specific components
│   │   │   └── 📁 reusable/      # Common reusable components
│   │   ├── 📁 context/           # React contexts
│   │   │   ├── auth-provider.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   └── query-provider.tsx
│   │   ├── 📁 hooks/             # Custom React hooks
│   │   │   ├── 📁 api/           # API-related hooks
│   │   │   └── use-*.tsx         # Utility hooks
│   │   ├── 📁 lib/               # Libraries and utilities
│   │   │   ├── api.ts            # API functions
│   │   │   ├── axios-client.ts   # Configured Axios instance
│   │   │   └── utils.ts          # Utility functions
│   │   ├── 📁 page/              # Page components
│   │   │   ├── 📁 auth/          # Authentication pages
│   │   │   ├── 📁 workspace/     # Workspace pages
│   │   │   └── 📁 errors/        # Error pages
│   │   ├── 📁 routes/            # Routing configuration
│   │   ├── 📁 types/             # TypeScript type definitions
│   │   └── 📁 layout/            # Layout components
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
├── README.md
├── package.json                   # Root package.json for scripts
└── .gitignore
```

## 🔐 **Security Features**

### **Authentication & Authorization**
- **JWT Tokens**: Secure, stateless authentication with 7-day expiration
- **HTTP-Only Cookies**: Secure token storage with SameSite protection
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **CORS Protection**: Configured for specific origins only
- **Session Management**: Secure session handling for OAuth flows

### **Data Protection**
- **Input Validation**: Comprehensive Zod schema validation on all inputs
- **SQL Injection Prevention**: MongoDB's built-in protection against injection attacks
- **XSS Protection**: Sanitized outputs and secure headers
- **Environment Variables**: All sensitive data stored securely in environment files

### **API Security**
- **Rate Limiting**: Configurable API rate limiting (ready for implementation)
- **Error Handling**: Sanitized error messages that don't expose sensitive information
- **Request Validation**: All API endpoints validate input data
- **Secure Headers**: CORS and security headers properly configured

## 🚀 **Deployment Guide**

### **Frontend Deployment (Netlify)**
1. **Build the application**:
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify**:
   - Upload the `dist` folder to Netlify
   - Or connect your GitHub repository for automatic deployments

3. **Environment Variables**:
   ```env
   VITE_API_URL=https://your-backend-domain.com/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Redirects Configuration**:
   Create `client/public/_redirects`:
   ```
   /*    /index.html   200
   ```

### **Backend Deployment (Render/Railway/Heroku)**
1. **Database Setup**:
   - Set up MongoDB Atlas for production
   - Get your connection string

2. **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=8000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secure-production-jwt-secret
   SESSION_SECRET=your-production-session-secret
   CLIENT_URL=https://your-frontend-domain.com
   FRONTEND_GOOGLE_CALLBACK_URL=https://your-frontend-domain.com/auth/google/callback
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. **Build Command**:
   ```bash
   npm run build
   ```

4. **Start Command**:
   ```bash
   npm start
   ```

### **Production Checklist**
- [ ] Update all environment variables for production
- [ ] Configure MongoDB Atlas with proper security
- [ ] Set up SSL/TLS certificates
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and logging
- [ ] Test all authentication flows
- [ ] Verify Google OAuth configuration
- [ ] Set up backup strategies

## 🔧 **Available Scripts**

### **Root Directory**
```bash
npm run dev          # Start both frontend and backend in development
npm run build        # Build both applications for production
npm run lint         # Lint both frontend and backend
npm run test         # Run tests for both applications
```

### **Backend Scripts**
```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npm run lint         # Run ESLint on backend code
npm run lint:fix     # Fix linting issues automatically
npm run test         # Run backend tests
```

### **Frontend Scripts**
```bash
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint on frontend code
npm run lint:fix     # Fix linting issues automatically
npm run test         # Run frontend tests
```

## 📡 **API Documentation**

### **Authentication Endpoints**
```
POST   /api/auth/register              # Register new user
POST   /api/auth/login                 # Login user
POST   /api/auth/logout                # Logout user
GET    /api/auth/google                # Initiate Google OAuth
GET    /api/auth/google/callback       # Google OAuth callback
GET    /api/user/current               # Get current user info
```

### **Workspace Management**
```
GET    /api/workspace/all              # Get user's workspaces
POST   /api/workspace/create/new       # Create new workspace
GET    /api/workspace/:id              # Get workspace by ID
PUT    /api/workspace/update/:id       # Update workspace
DELETE /api/workspace/delete/:id       # Delete workspace
GET    /api/workspace/members/:id      # Get workspace members
PUT    /api/workspace/change/member/role/:id  # Change member role
```

### **Project Management**
```
GET    /api/project/workspace/:workspaceId           # Get all projects
POST   /api/project/workspace/:workspaceId/create    # Create project
GET    /api/project/:id/workspace/:workspaceId       # Get project by ID
PUT    /api/project/:id/workspace/:workspaceId/update # Update project
DELETE /api/project/:id/workspace/:workspaceId/delete # Delete project
```

### **Task Management**
```
GET    /api/task/workspace/:workspaceId              # Get all tasks
POST   /api/task/workspace/:workspaceId/create       # Create task
GET    /api/task/:id/workspace/:workspaceId          # Get task by ID
PUT    /api/task/:id/workspace/:workspaceId/update   # Update task
DELETE /api/task/:id/workspace/:workspaceId/delete   # Delete task
```

### **Member Management**
```
POST   /api/member/workspace/:inviteCode/join        # Join workspace via invite
DELETE /api/member/workspace/:workspaceId/remove/:memberUserId # Remove member
```

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper tests
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Update documentation when needed
- Follow the existing code style and patterns
- Add tests for new functionality

### **Code Style**
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Comment complex logic
- Use TypeScript types consistently
- Follow React best practices

## 🐛 **Troubleshooting**

### **Common Issues**

**Authentication Problems:**
- Ensure environment variables are set correctly
- Check that Google OAuth credentials match your domain
- Verify JWT_SECRET is set and consistent

**Database Connection Issues:**
- Ensure MongoDB is running (local) or connection string is correct (Atlas)
- Check network connectivity
- Verify database permissions

**Build Issues:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Ensure all environment variables are set

**CORS Issues:**
- Verify CLIENT_URL matches your frontend domain
- Check CORS configuration in backend
- Ensure credentials are properly set

## 📋 **Roadmap**

### **Phase 1 - Core Enhancements**
- [ ] Real-time notifications system
- [ ] Advanced task filtering and search
- [ ] File attachments for tasks and projects
- [ ] Bulk operations for tasks

### **Phase 2 - Collaboration Features**
- [ ] Team chat and messaging
- [ ] Comments and discussions on tasks
- [ ] Activity feed and notifications
- [ ] @mentions and team notifications

### **Phase 3 - Advanced Features**
- [ ] Time tracking and reporting
- [ ] Gantt charts and timeline view
- [ ] Calendar integration
- [ ] Advanced analytics and reporting
- [ ] Custom fields and templates

### **Phase 4 - Integrations**
- [ ] Webhook support
- [ ] Third-party integrations (Slack, GitHub, etc.)
- [ ] API rate limiting and quotas
- [ ] Mobile application
- [ ] Desktop application (Electron)

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React Query](https://tanstack.com/query) for excellent data fetching
- [Zod](https://zod.dev/) for runtime type validation
- The open-source community for inspiration and support

## 📧 **Support**

For support, email support@flowmatic.com or join our Discord server.

---

<div align="center">
  <p>Built with ❤️ by the Flowmatic team</p>
  <p>© 2025 Flowmatic. All rights reserved.</p>
</div>
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

