import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/env";

export const generateToken = (payload: object, secret: string, expiresIn: '15m' | '7d') => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};