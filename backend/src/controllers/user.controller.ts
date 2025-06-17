import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getCurrentUserService } from "../services/user.service";
import jwt from "jsonwebtoken";
import { config } from "../config/app.config";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: '7d' });
};

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { user } = await getCurrentUserService(userId);

    const token = generateToken(userId.toString());

    return res.status(HTTPSTATUS.OK).json({
      message: "User fetch successfully",
      user,
      token,
    });
  }
);
