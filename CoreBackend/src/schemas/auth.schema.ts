import {z} from 'zod';

const phoneNumberSchema =z 
.string()
.regex(/^\d{10}$/, "Phone number must be  exactly 10 digits")
.min(10, "Phone number must be 10 digits")
.max(10, "Phone number must be 10 digits");

const otpSchema =z
.string()
.regex(/^\d{6}$/, "OTP must be exactly 6 digits ")
.min(6, "OTP must be 6 digits")
.max(6, "OTP must be 6 digits");

export const requestOtpSchema= z.object({
    body: z.object({
        phoneNumber: phoneNumberSchema,
        isNewUserFlow : z.boolean().optional().default(false),

    }),
});

export const verifyOtpSchema = z.object({
    body:z.object({
        phoneNumber: phoneNumberSchema,
        otp: otpSchema,
    }),
})