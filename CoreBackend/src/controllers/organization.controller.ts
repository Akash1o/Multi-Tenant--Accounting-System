import { Request,Response,NextFunction, } from "express";
import { OrganizationService } from "../services/organization.service";
import { sendResponse } from "../utils/sendResponse";
export class  OrganizationController {

    static async createOrganization(
        req:Request,
        res:Response,
        next:NextFunction
    ){
       try{
     const { name } = req.body
        const userId=req.user!.id;
      

          const organization = await OrganizationService.createOrganization(
            
            name,
             userId
            
          )
          sendResponse(res,201, "Organization created successfully",organization)
       }
       catch(err){
        next(err)
       }
    }
}