import prisma from "../config/prisma"
import throwError from "../utils/AppError"

export class TransactionService {

  static async createTransaction(userId: number, flow: "IN" | "OUT", amount: number, type: "CASH" | "QR" | "CREDIT", partyId: number, organizationId: number, note: string | undefined) {

    const memebership = await prisma.userOrganization.findFirst
      ({
        where: {
          userId, organizationId
        }
      })

    if (!memebership) {
      throwError(403, "You don't belong to this organization.")
    }

    const party = await prisma.party.findUnique({
      where: { id: partyId }
    });

    if (!party) {
      throwError(404, "Party not found");
    }

    const transaction = await prisma.transaction.create({
      data: {
        flow,
        amount,
        type,
        partyId,
        organizationId,
        note
      }

    })
    await prisma.party.update({
      where: { id: partyId },
      data: {
        balance: {
          increment: flow === "IN" ? amount : -amount
        }
      }
    });


    return transaction
  }


  static async getTransactions(organizationId: number, userId: number) {


    const memebership = await prisma.userOrganization.findFirst
      ({
        where: {
          userId, organizationId
        }
      })

    if (!memebership) {
      throwError(403, "You don't belong to this organization.")
    }

    const transactions = await prisma.transaction.findMany({
      where: {

        organizationId

      }


    })
    return transactions;

  }

  static async getTransactionById(transactionId: number, userId: number) {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId

      }
    })

    if (!transaction) {
      throwError(404, "Transaction is not found")
    }
    const memebership = await prisma.userOrganization.findFirst
      ({
        where: {
          userId, organizationId: transaction!.organizationId
        }
      })

    if (!memebership) {
      throwError(403, "You don't belong to this organization.")
    }

    return transaction
  }

}