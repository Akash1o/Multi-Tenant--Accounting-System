import { Request,Response,NextFunction, } from "express";
import { PartyService } from "../services/party.service";
import { sendResponse } from "../utils/sendResponse";
import prisma from "../config/prisma";

export class  PartyController {

    static async createParty(
        req:Request,
        res:Response,
        next:NextFunction
    )
    {
        try{
            const {name,phoneNumber, type,organizationId} =req.body;
          const userId=req.user!.id;
          const orgId = Number(organizationId);
            const party = await PartyService.createParty(
                name,
                  orgId,
                phoneNumber,
                type,
                userId
            )
            sendResponse(res,201, "Party created successfully", party)
          
        }
        catch(err){
            next(err)
        }
    }


     static async getParties(
        req:Request,
        res:Response,
        next:NextFunction
    ){
        try{
             const {organizationId} =req.query;
             const userId=req.user!.id;
              const orgId = Number(organizationId);
             const Parties =await PartyService.getParties(
                orgId,
                userId
             )
             sendResponse(res,202,"Party is fetched successfully", Parties)
        }
        catch(err){
            next(err)
        }
    }


     static async getPartyById(
        req:Request,
        res:Response,
        next:NextFunction
    ){
        try{
            const partyId =req.params.id;
            const userId =req.user!.id;
            const partiId= Number(partyId)

            const PartybyId= await PartyService.getPartyById(
                partiId,
                userId
            )
            sendResponse(res,200,"A single party is fetched .",PartybyId)
        }
        catch(err){
            next(err)
        }
    }

     static async updateParty(
        req:Request,
        res:Response,
        next:NextFunction
    ){
        try{
            const {name,phone,type} = req.body;
             const partyId =req.params.id;
            const userId =req.user!.id;
            const partiId= Number(partyId)

            const updateParty = await PartyService.updateParty(
                partiId,
                userId,
                name,
                phone,
                type
            )
            sendResponse(res, 200, "Party updated successfully", updateParty)
           
        }
         catch(err){
                next(err)
            }
    }

    static async deleteParty(
        req:Request,
        res:Response,
        next:NextFunction
    ){
        try{
            const partyId =req.params.id;
            const userId =req.user!.id;
            const partiId= Number(partyId)
            const deleteParty = await PartyService.deleteParty(
                partiId,
                userId
            )
            sendResponse(res,200, "Party delete sucessfully", deleteParty)
        }

        catch(err){
            next(err)
        }
    }
}