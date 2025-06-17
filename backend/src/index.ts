import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import cookieParser from "cookie-parser";
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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://flowmatic-pm.netlify.app",
      "http://localhost:5173", 
      "http://localhost:3000",
      "http://localhost:4173",
    ],
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

app.use(
  session({
    name: "oauth-session",
    keys: [config.SESSION_SECRET],
    maxAge: 10 * 60 * 1000,
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    signed: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/debug/workspace/:id/members', isAuthenticatedJWT, async (req: Request, res: Response) => {
  try {
    const workspaceId = req.params.id;
    const userId = req.user?._id;
    
    const WorkspaceModel = require('./models/workspace.model').default;
    const workspace = await WorkspaceModel.findById(workspaceId);
    
    const MemberModel = require('./models/member.model').default;
    const member = await MemberModel.findOne({ userId, workspaceId });
    
    res.json({
      workspaceId,
      workspaceExists: !!workspace,
      userIsMember: !!member,
      userId,
      member: member ? {
        role: member.role,
        joinedAt: member.joinedAt
      } : null
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Handle preflight requests
app.options('*', (req: Request, res: Response) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(HTTPSTATUS.OK).json({
      message: "Flowmatic Backend API",
      version: "1.0.0",
    });
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticatedJWT, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticatedJWT, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticatedJWT, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticatedJWT, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticatedJWT, taskRoutes);

app.use(errorHandler);

const server = app.listen(config.PORT, async () => {
  try {
    await connectDatabase();
  } catch (error) {
    process.exit(1);
  }
});

const gracefulShutdown = (signal: string) => {
  server.close(() => {
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  process.exit(1);
});