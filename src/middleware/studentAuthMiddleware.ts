import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import { KEYS } from "../constants";
import { DoesNotExistError } from "../errors";

interface AuthenticatedRequest extends Request {
  studentId?: string;
}

export default function studentAuthMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new DoesNotExistError("Invalid token");
    }

    const token = authorization.replace("Bearer", "").trim();
    const { id } = jwt.verify(token, KEYS.JWT.STUDENT) as TokenPayload;

    req.studentId = id;

    return next();
  } catch (error) {
    if (
      error instanceof DoesNotExistError ||
      error instanceof TokenExpiredError
    ) {
      return {
        status_code: res.status(401).json({ message: "Invalid token" }),
      };
    }
  }
}
