import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

import { KEYS } from "../constants";
import { DoesNotExistError } from "../errors";

interface CustomRequest extends Request {
  userId?: string;
}

export default async function userAuthMiddleware(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new DoesNotExistError("Invalid token");
    }

    const token = authorization.replace("Bearer", "").trim();

    const { id } = jwt.verify(token, KEYS.JWT.USER) as TokenPayload;
    req.userId = id;
    return next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new DoesNotExistError("Invalid token");
    }
    throw error;
  }
}
