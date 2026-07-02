import app from "./app";
import {config} from "./config/env"
import http from "http";
import logger from "./utils/logger";


process.on("uncaughtException",(err)=>{
    logger.error("UNCAUGHT EXCEPTION", err);
})


process.on("unhandledRejection",(err)=>{
    logger.error("UNHANDLED REJECTION", err);
})


const PORT =config.port;
const server = http.createServer(app);


server.listen(PORT , () =>{
    logger.info(
        `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`,
    )
})


const gracefulShutdown = async(signal: string) => {
  logger.info(`${signal} received : closing HTTP server`);
    server.close(()=>{
        logger.info("HTTP server is closed");
        process.exit(0);
    })
}
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
