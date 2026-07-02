import { Request, Response, NextFunction } from "express"
import { AuthService } from "../services/auth.service";
import { sendResponse } from "../utils/sendResponse";

export class AuthController {

    static async requestOtp(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { phoneNumber } = req.body;
            const { isNew, otp } = await AuthService.requestOtp(phoneNumber);
            sendResponse(res, 200, "OTP send succesfully", { isNew, otp })
        } catch (err) {
            next(err)
        }
    }

    static async verifyOtp(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { phoneNumber, otp } = req.body;
            const result = await AuthService.verifyOtp(
                phoneNumber,
                otp
            );
            sendResponse(res, 200, "Login succesful", result)
        }
        catch (err) {
            next(err)
        }
    }
}