import { NextFunction, Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import jwt from "jsonwebtoken";
import { config } from "../config/app.config";
import UserModel from "../models/user.model";

const isAuthenticatedJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = req.cookies.authToken;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized. Please log in.",
        errorCode: "ACCESS_UNAUTHORIZED"
      });
      return;
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    
    const user = await UserModel.findById(decoded.userId).populate('currentWorkspace');
    
    if (!user) {
      res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not found.",
        errorCode: "USER_NOT_FOUND"
      });
      return;
    }

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
