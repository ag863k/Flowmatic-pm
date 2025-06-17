import { NextFunction, Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import jwt from "jsonwebtoken";
import { config } from "../config/app.config";
import UserModel from "../models/user.model";

const isAuthenticatedJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from cookie
    const token = req.cookies.authToken;
    
    if (!token) {
      res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized. Please log in.",
        errorCode: "ACCESS_UNAUTHORIZED"
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    
    // Get user from database
    const user = await UserModel.findById(decoded.userId).populate('currentWorkspace');
    
    if (!user) {
      res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not found.",
        errorCode: "USER_NOT_FOUND"
      });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(HTTPSTATUS.UNAUTHORIZED).json({
      message: "Invalid token.",
      errorCode: "INVALID_TOKEN"
    });
    return;
  }
};

export default isAuthenticatedJWT;
