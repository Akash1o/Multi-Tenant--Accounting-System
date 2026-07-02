import { Request, Response, NextFunction, } from "express";
import { TransactionService } from "../services/transaction.service";
import { sendResponse } from "../utils/sendResponse";
import throwError from "../utils/AppError"
import prisma from "../config/prisma";


export class TransactionController {

    static async createTransaction(req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const { flow, amount, type, organizationId, partyId, note } = req.body;
            const userId = req.user!.id;
            const orgId = Number(organizationId);

            const partiId = Number(partyId)

            const createTrans = await TransactionService.createTransaction(
                userId,
                flow,
                amount,
                type,
                partiId,
                orgId,
                note
            )
            sendResponse(res, 201, "Party created Successfully", createTrans)
        }
        catch (err) {
            next(err)
        }
    }

    static async getTransactions(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { organizationId } = req.query;
            const userId = req.user!.id;
            const orgId = Number(organizationId);
            const Transactions = await TransactionService.getTransactions(
                orgId,
                userId
            )
            sendResponse(res, 202, "Transactios are fetched successfully", Transactions)
        }
        catch (err) {
            next(err)
        }
    }

    static async getTransactionById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const transactionId = req.params.id;
            const userId = req.user!.id;
            const traId = Number(transactionId)

            const transactionById = await TransactionService.getTransactionById(
                traId,
                userId
            )
            sendResponse(res, 200, "A single transaction is fetched .", transactionById)
        }
        catch (err) {
            next(err)
        }
    }
}