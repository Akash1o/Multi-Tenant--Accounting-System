import express, {Application, Request , Response , NextFunction }from "express";
import cors from "cors";
import errorHandlerMiddleware from "./middlewares/errorMiddleware";
import logger from "./utils/logger";
import AuthRouter from "./routes/auth.route";
import PartyRouter from "./routes/party.route"
import TransactionRouter from "./routes/transaction.route"
import OrganizationRouter from "./routes/organization.route"
const app : Application= express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes 
app.use("/api/parties", PartyRouter)
app.use("/api",AuthRouter)
app.use("/api/transactions", TransactionRouter);
app.use("/api/organization", OrganizationRouter)



//checking  app is alive or not 

app.get("/health", (req: Request, res:Response) =>{
    logger.info("Health check endpoint called ");
    res.status(200).json({status: "UP"});
});


app.use(errorHandlerMiddleware)

export default app;