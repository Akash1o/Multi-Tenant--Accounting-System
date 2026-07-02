import prisma from "../config/prisma";


export class OrganizationService{
    static async createOrganization(name:string, userId:number){

        const organization= await prisma.organization.create({
            data:{
                name
            }
        }
        );
 
  // 2. auto join as OWNER
  await prisma.userOrganization.create({
    data: {
      userId,
      organizationId: organization.id,
      role: "OWNER"
    }
  });

   return  organization;

    }
}