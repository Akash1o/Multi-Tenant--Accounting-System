import { Router } from "express";
import { createTransSchema, getTransactionsSchema, getTransByIdSchema } from "../schemas/transaction.schema";
import { authenticateMiddleware } from "../middlewares/authMiddleware";
import validateRequest from "../middlewares/validateRequestMiddleware";
import { TransactionController } from "../controllers/transaction.controller";


const router = Router();


router.post(
    "/",
    authenticateMiddleware,
    validateRequest(createTransSchema),
    TransactionController.createTransaction

)


router.get(
    "/",
    authenticateMiddleware,
    validateRequest(getTransactionsSchema),
    TransactionController.getTransactions

)


router.get(
    "/:id",
    authenticateMiddleware,
    validateRequest(getTransByIdSchema),
    TransactionController.getTransactionById

)



export default router;