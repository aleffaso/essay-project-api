import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

import { KEYS } from "../constants";

export default async function userAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const token = authorization.replace("Bearer", "").trim();

    const { id } = jwt.verify(token, KEYS.JWT.USER) as TokenPayload;

    req.userId = id;

    return next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    throw error;
  }
}
