import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

// Create an access token
export function createAccessToken(userId:String): string {
  return jwt.sign(userId, process.env.JWT_SECRET_KEY as string , {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE_DAYS,
  });
}

// Create a refresh token
export function createRefreshToken(userId: String): string {
  return jwt.sign({},process.env.JWT_SECRET_KEY as string , {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE_DAYS,
  });
}

// Verify a token and extract user info
export function verifyToken(token: string): string | JwtPayload | null {
  try {
    return jwt.verify(token,process.env.JWT_SECRET_KEY as string);
  } catch (e) {
    return null;
  }
}

// Set JWT in cookies
export function setTokensInCookies(res: NextApiResponse, accessToken: string, refreshToken: string) {
  res.setHeader('Set-Cookie', [
    cookie.serialize('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, 
      path: '/',
    }),
    cookie.serialize('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
    }),
  ]);
}

// Get access token from cookies
export function getAccessTokenFromCookies(req: NextApiRequest): string | undefined {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies.access_token;
}

// Get refresh token from cookies
export function getRefreshTokenFromCookies(req: NextApiRequest): string | undefined {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies.refresh_token;
}


