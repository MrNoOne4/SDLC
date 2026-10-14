import bcrypt from "bcryptjs";
import  prisma  from "@/lib/prisma";
import { signToken, type SessionRole } from "@/lib/auth/jwt";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth/session";

export interface UserProps {
  userId?: string;
  username: string;
  passwordHash: string;
  email: string;
  isActive?: boolean;
}

export abstract class User {
  readonly userId: string;
  username: string;
  passwordHash: string;
  email: string;
  isActive: boolean;

  constructor(props: UserProps) {
    this.userId = props.userId ?? crypto.randomUUID();
    this.username = props.username;
    this.passwordHash = props.passwordHash;
    this.email = props.email;
    this.isActive = props.isActive ?? true;
  }

  /** The role stored inside the JWT. Each subclass decides its own. */
  abstract get sessionRole(): SessionRole;

  // ---- methods ----
  /** Verifies the password, then issues the JWT session cookie. */
  async login(plainPassword: string): Promise<void> {
    if (!this.isActive) throw new Error("Account is deactivated");
    const ok = await bcrypt.compare(plainPassword, this.passwordHash);
    if (!ok) throw new Error("Invalid username or password");

    const token = await signToken({
      sub: this.userId,
      username: this.username,
      role: this.sessionRole,
    });
    await setSessionCookie(token);
  }

  async logout(): Promise<void> {
    await clearSessionCookie();
  }

  async resetPassword(newPassword: string): Promise<void> {
    if (newPassword.length < 8)
      throw new Error("Password must be at least 8 characters");
    this.passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { userId: this.userId },
      data: { passwordHash: this.passwordHash },
    });
  }

  toPlain(): Record<string, unknown> {
    const { passwordHash, ...rest } = this;
    return rest;
  }
}
