// lib/auth/session.ts
import { jwtVerify } from "jose";
import type { UserRole } from "./roles";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "your-secret-key-change-in-production"
);

export interface SessionPayload {
  userId: string;
  role: UserRole;
  email: string;
}

/**
 * Verifies and decodes the JWT token from the request cookie.
 * Returns null if the token is missing or invalid.
 */
export async function getSessionFromToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
