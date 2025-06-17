import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import { registerUserService, verifyUserService } from "../services/auth.service";
import UserModel from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Generate JWT token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: '7d' });
};

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    
    if (!user) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure&error=user_not_found`
      );
    }

    const currentWorkspace = user.currentWorkspace;

    if (!currentWorkspace) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure&error=no_workspace`
      );
    }

    // Generate JWT token and set as cookie
    const token = generateToken(user._id.toString());
    
    // Set token as HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.redirect(
      `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace._id}?status=success`
    );
  }
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    const { userId, workspaceId } = await registerUserService(body);

    // Get the created user with populated workspace
    const user = await UserModel.findById(userId)
      .populate('currentWorkspace')
      .select('-password');

    if (!user) {
      return res.status(HTTPSTATUS.CREATED).json({
        message: "User created successfully",
        workspaceId,
      });
    }

    // Auto-login the user after successful registration using JWT
    const token = generateToken((user as any)._id.toString());
    
    // Set token as HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created and logged in successfully",
      user,
      workspaceId,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Email and password are required",
      });
    }

    try {
      // Verify user credentials
      const user = await verifyUserService({ email, password });
      
      // Generate JWT token
      const token = generateToken((user as any)._id.toString());
      
      // Set token as HTTP-only cookie
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Populate user data with currentWorkspace
      const populatedUser = await UserModel.findById(user._id)
        .populate('currentWorkspace')
        .select('-password');

      return res.status(HTTPSTATUS.OK).json({
        message: "Logged in successfully",
        user: populatedUser,
      });
    } catch (error: any) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: error.message || "Invalid email or password",
      });
    }
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    // Clear the JWT token cookie
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'none'
    });
    
    return res
      .status(HTTPSTATUS.OK)
      .json({ message: "Logged out successfully" });
  }
);