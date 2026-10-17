import { NextFunction, Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";

const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || !req.user._id) {
    res.status(HTTPSTATUS.UNAUTHORIZED).json({
      message: "Unauthorized. Please log in.",
      errorCode: "ACCESS_UNAUTHORIZED"
    });
    return;
  }
  next();
};

export default isAuthenticated;
