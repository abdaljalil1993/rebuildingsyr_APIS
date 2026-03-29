import { NextFunction, Request, Response } from "express";
import { QueryFailedError } from "typeorm";
import { ApiError } from "../utils/api-error";

interface MysqlError {
  code?: string;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  if (err instanceof QueryFailedError) {
    const driverError = err.driverError as MysqlError;

    if (driverError.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Duplicate record detected"
      });
    }
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};
