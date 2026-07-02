import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret-change-in-prod',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-in-prod',
jwtAccessExpiry: '7d' as const,
    jwtRefreshExpiry: '7d' as const,
};