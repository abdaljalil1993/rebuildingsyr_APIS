import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error";

export const validateDto = <T extends object>(dtoClass: new () => T) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true
    });

    if (errors.length > 0) {
      const details = errors
        .map((error) => Object.values(error.constraints ?? {}).join(", "))
        .filter(Boolean)
        .join("; ");

      return next(new ApiError(400, details || "Validation failed"));
    }

    req.body = dtoObject;
    return next();
  };
};

export const validateQueryDto = <T extends object>(dtoClass: new () => T) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.query);
    const errors = await validate(dtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true
    });

    if (errors.length > 0) {
      const details = errors
        .map((error) => Object.values(error.constraints ?? {}).join(", "))
        .filter(Boolean)
        .join("; ");

      return next(new ApiError(400, details || "Query validation failed"));
    }

    Object.assign(req.query as Record<string, unknown>, dtoObject as Record<string, unknown>);
    return next();
  };
};
