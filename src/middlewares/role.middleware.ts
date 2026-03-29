import { NextFunction, Request, Response } from "express";
import { AccountType } from "../constants/enums";
import { ApiError } from "../utils/api-error";

export const authorizeRoles = (...allowedRoles: AccountType[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    if (!allowedRoles.includes(req.user.accountType)) {
      return next(new ApiError(403, "Forbidden"));
    }

    return next();
  };
};
