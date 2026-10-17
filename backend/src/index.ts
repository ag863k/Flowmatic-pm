import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";

import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import isAuthenticatedJWT from "./middlewares/isAuthenticatedJWT.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Trust proxy for production deployment
app.set('trust proxy', 1);

// CORS configuration
const allowedOrigins = [
  "https://flowmatic-pm.netlify.app",
  "http://localhost:5173", 
  "http://localhost:3000",
  "http://localhost:4173",
  config.FRONTEND_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "X-Requested-With",
      "Accept",
      "Origin",
      "Cache-Control",
      "Cookie"
    ],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200,
    preflightContinue: false
  })
);

// Session configuration
app.use(
  session({
    name: "oauth-session",
    keys: [config.SESSION_SECRET],
    maxAge: 10 * 60 * 1000,
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
    signed: true,
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Request timeout middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setTimeout(30000, () => {
    console.error('Request timeout:', req.method, req.path);
    res.status(HTTPSTATUS.GATEWAY_TIMEOUT).json({
      message: 'Request timeout',
      code: 'TIMEOUT'
    });
  });
  next();
});

// Handle preflight requests
app.options('*', (req: Request, res: Response) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

// Health check endpoint
app.get(
  '/health',
  asyncHandler(async (req: Request, res: Response) => {
    return res.status(HTTPSTATUS.OK).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV,
    });
  })
);

// Root endpoint
app.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    return res.status(HTTPSTATUS.OK).json({
      message: "Flowmatic Backend API",
      version: "1.0.0",
      status: "running",
      documentation: "/api",
    });
  })
);

// API Routes
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticatedJWT, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticatedJWT, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticatedJWT, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticatedJWT, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticatedJWT, taskRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(HTTPSTATUS.NOT_FOUND).json({
    message: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use(errorHandler);

const server = app.listen(config.PORT, async () => {
  console.log('\nStarting Flowmatic Backend...');
  console.log(`Environment: ${config.NODE_ENV}`);
  console.log(`Port: ${config.PORT}`);
  console.log(`Base Path: ${BASE_PATH}`);
  
  try {
    await connectDatabase();
    console.log('\nServer is ready and listening');
    console.log(`Health check: http://localhost:${config.PORT}/health`);
    console.log(`API: http://localhost:${config.PORT}${BASE_PATH}\n`);
  } catch (error) {
    console.error('\nFailed to start server:', error);
    process.exit(1);
  }
});

const gracefulShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}, shutting down gracefully...`);
  
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});