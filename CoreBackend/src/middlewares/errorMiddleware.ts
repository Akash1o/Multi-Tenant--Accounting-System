import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/AppError";
import logger from "../utils/logger";


const errorHandlerMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {

    //logl with error with request info
    logger.error("error occured", {
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        query: req.query,
          message: err.message,  // ← ADD THIS
    stack: err.stack  

    })
 if (err instanceof ZodError){
     res.status(400).json({
        success:false,
        message: "Validation error",
    errors: err.issues})
 }

 else if (err instanceof ApiError) {
  res.status(err.statusCode).json({
    success: false,
    message:err.message,
  });
}
else{
res.status(500).json({
    success:false,
    message: "Internal Serval Error",
    ...(process.env.NODE_ENV !== "production" && {stack: err.stack})
})
    
}
}

export default errorHandlerMiddleware;

