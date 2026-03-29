import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing or invalid authorization header"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (_error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};
