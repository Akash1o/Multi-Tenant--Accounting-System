import type { Response } from "express";


export const sendResponse = (
  res: Response,
  status: number,
  message: string,
  data?: any
) => {
  res.status(status).json({ message, data, success: status < 400 });
};
