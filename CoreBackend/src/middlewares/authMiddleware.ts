import {Request,Response, NextFunction } from "express";
import throwError, { ApiError } from "../utils/AppError";

import { verifyToken } from "../utils/jwt";
import { config } from "../config/env";

export async function authenticateMiddleware(
    req:Request,
    res:Response,
    next:NextFunction
){

    try{
        const authHeader =req.headers.authorization;
        console.log("AUTH HEADER:", authHeader);
        if(!authHeader || !authHeader.startsWith("Bearer")){
          throwError(401, "Access denied. No token provided.")
        }

     const token = authHeader!.split(" ")[1];
console.log("TOKEN PARTS:", token.split(".").length); // should be 3
console.log("TOKEN:", token);
        if(!token) {
            throwError(401, "Access denied. Invalid token format.")
        }

        const decoded = await verifyToken(
            token,
            String(config.jwtAccessSecret));
         req.user={
         id: decoded.userId as number
         }; 
         next();


        
    }
    catch(err:any){
     if(err.name === "TokenExpiredError"){
     return next (new ApiError(401, "Token has expired "))

     }
     if(err.name === "JsonWebTokenError") {
     return next (new ApiError(401, "Invalid token "))
     }
     next(err)
    }
}