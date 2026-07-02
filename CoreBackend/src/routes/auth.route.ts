import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import validateRequest from "../middlewares/validateRequestMiddleware";
import { requestOtpSchema, verifyOtpSchema } from "../schemas/auth.schema";
import { authenticateMiddleware } from "../middlewares/authMiddleware";
const router =Router();

    router.post(
        "/otp/request",
        validateRequest(requestOtpSchema),
        AuthController.requestOtp

    )

    router.post(
        "/otp/verify",
        validateRequest(verifyOtpSchema),
        AuthController.verifyOtp
    )



    export default router;