import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "session";

export type SessionRole =
  | "Student"
  | "Registrar"
  | "Cashier"
  | "DepartmentStaff"
  | "SystemAdmin";

export interface SessionPayload {
  sub: string;
  username: string;
  role: SessionRole;
}

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET);

export async function signToken(payload: SessionPayload, expiresIn = "8h") {
  return new SignJWT({ username: payload.username, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      sub: payload.sub as string,
      username: payload.username as string,
      role: payload.role as SessionRole,
    };
  } catch {
    return null; // expired / tampered / malformed
  }
}
