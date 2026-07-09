import prisma from "../config/prisma";
import { generateOtp } from "../utils/otp";
import throwError from "../utils/AppError";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { generateToken } from "../utils/jwt";

export class AuthService {

//   


static async requestOtp(phoneNumber: string)
  : Promise<{ isNew: boolean; otp: string }> {  // ← fix here

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const recentOtpCount = await prisma.otp.count({
    where: { phoneNumber, createdAt: { gte: fiveMinutesAgo } }
  });

  const hourlyOtpCount = await prisma.otp.count({
    where: { phoneNumber, createdAt: { gte: oneHourAgo } }
  });

  if (recentOtpCount > 4 || hourlyOtpCount > 15) {
    throwError(400, "Too many OTPs sent. Try again later.");
  }

  const user = await prisma.user.findUnique({
    where: { phoneNumber }
  });

  const otp = generateOtp();

  await prisma.otp.create({
    data: { phoneNumber, code: otp }
  });

  return { otp, isNew: !user };  
}

  static async verifyOtp(phoneNumber: string, otp: string)
    : Promise<{
      accessToken: string;
      refreshToken: string;
      user: { id: number; phoneNumber: string; firstName: string | null; lastName: string | null };
      organizations: { id: number; name: string; role: string }[];
    }> {
    const otpRecord = await prisma.otp.findFirst({
      where: { phoneNumber },
      orderBy: { createdAt: "desc" }
    });
    if (!otpRecord) {
      throwError(400, "No OTP found. Please request a new one.");
    }

    // 1. Calculate expiry time
    const otpExpiry = new Date(otpRecord!.createdAt);
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

    // 2. Check if expired
    if (new Date() > otpExpiry) {
      throwError(410, "OTP has expired. Please request a new one.");
    }

    // 3. Check if OTP matches
    if (otp !== otpRecord!.code) {
      throwError(400, "Invalid OTP");
    }

    const user = await prisma.user.upsert({
      where: { phoneNumber },   // try to find this user
      update: {},               // if found → do nothing, just return them
      create: { phoneNumber }   // if not found → create new user
    });

    // Load any organizations this user already belongs to, so a returning
    // user doesn't get funneled into "create organization" again.
    // NOTE: adjust the model/relation names below if your schema.prisma
    // names them differently (e.g. prisma.userOrganization / .organization).
    const userOrganizations = await prisma.userOrganization.findMany({
      where: { userId: user.id },
      include: { organization: true }
    });

    const organizations = userOrganizations.map((uo) => ({
      id: uo.organization.id,
      name: uo.organization.name,
      role: uo.role,
    }));

    const accessToken = jwt.sign(
      { userId: user.id },
      config.jwtAccessSecret,
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      config.jwtRefreshSecret,
      { expiresIn: '7d' }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        firstName: (user as any).firstName ?? null,
        lastName: (user as any).lastName ?? null,
      },
      organizations,
    };
  }
}