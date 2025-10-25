import jwt from 'jsonwebtoken';
import { AuthTokens } from '@ai-playground/shared';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateTokens = async (userId: string): Promise<AuthTokens> => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  // Store refresh token in database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = async (token: string): Promise<string | null> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };

    // Check if token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    return null;
  }
};

export const revokeRefreshToken = async (token: string): Promise<void> => {
  await prisma.refreshToken.delete({
    where: { token },
  }).catch(() => {
    // Token doesn't exist, ignore
  });
};
