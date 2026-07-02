import prisma from "../config/prisma"
import throwError from "../utils/AppError"

export class PartyService {
    static async createParty(name:string,organizationId:number ,phoneNumber: string | undefined,
  type: "CUSTOMER" | "SUPPLIER", userId:number){


   const memebership = await prisma.userOrganization.findFirst 
   ({
    where:{
        userId,organizationId
    }
   })

   if(!memebership){
    throwError(403, "You don't belong to this organization.")
   }
          const party = await prisma.party.create({
            data:{
                name,
                organizationId,
               phone: phoneNumber,
                type

            }
          });
          return party
       
    }

    static async getParties( organizationId:number,userId:number)
    {

        
   const memebership = await prisma.userOrganization.findFirst 
   ({
    where:{
        userId,organizationId
    }
   })

   if(!memebership){
    throwError(403, "You don't belong to this organization.")
   }

        const parties=await prisma.party.findMany({
            where:{
         
                organizationId,
                 deletedAt: null
               
            }
   
          
        })
         return parties;
   
    }
     static async getPartyById(partyId:number , userId:number)
     {
        const party= await prisma.party.findUnique({
            where:{
               id: partyId,
                
            }
        })

        if(!party){
            throwError(404,"Party is not found")
        }
   const memebership = await prisma.userOrganization.findFirst 
   ({
    where:{
        userId,organizationId:party!.organizationId
    }
   })

   if(!memebership){
    throwError(403, "You don't belong to this organization.")
   }

   return party
     }

     static async updateParty(partyId:number, userId:number, name:string, phone:string | undefined, type: "CUSTOMER" | "SUPPLIER"){
          const party= await prisma.party.findUnique({
            where:{
               id: partyId,
                
            }
        })
          if(!party){
            throwError(404,"Party is not found")
        }
   const memebership = await prisma.userOrganization.findFirst 
   ({
    where:{
        userId,organizationId:party!.organizationId
    }
   })

   if(!memebership){
    throwError(403, "You don't belong to this organization.")
   }


         const updatedParty = await prisma.party.update({
            where:{id: partyId},
            data:{
                name,
                phone,
                type
            }
         })

         return updatedParty
     }
 static async deleteParty(partyId: number, userId: number) {
  const party = await prisma.party.findUnique({
    where: { id: partyId }
  });

  if (!party) {
    throwError(404, "Party not found");
  }

  const membership = await prisma.userOrganization.findFirst({
    where: { userId, organizationId: party!.organizationId }
  });

  if (!membership) {
    throwError(403, "You don't belong to this organization.");
  }

  const deletedParty = await prisma.party.update({
    where: { id: partyId },
    data: { deletedAt: new Date() }
  });

  return deletedParty;
}

      }
