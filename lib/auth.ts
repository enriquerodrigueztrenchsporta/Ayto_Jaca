import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: "ADMIN" | "EDITOR" } & DefaultSession["user"];
  }
  interface User {
    role?: "ADMIN" | "EDITOR";
  }
}

class TooManyAttempts extends CredentialsSignin {
  code = "rate_limited";
}

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(1).max(200),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: { email: { label: "Correo electrónico" }, password: { label: "Contraseña", type: "password" } },
      async authorize(raw, request) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const ip = request?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
        // 5 intentos por email+IP cada 15 minutos; 30 por IP.
        if (!rateLimit(`login:${email}:${ip}`, 5, 15 * 60_000).ok || !rateLimit(`login-ip:${ip}`, 30, 15 * 60_000).ok) {
          throw new TooManyAttempts();
        }
        const user = await db.user.findUnique({ where: { email } });
        const valid = user?.active ? await bcrypt.compare(password, user.passwordHash) : false;
        if (!user || !valid) {
          await audit({ action: "LOGIN_FAILED", entityType: "User", entityTitle: email });
          return null;
        }
        await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        await audit({ action: "LOGIN", entityType: "User", entityId: user.id, user });
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role ?? "EDITOR";
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = String(token.uid ?? "");
      session.user.role = (token.role as "ADMIN" | "EDITOR") ?? "EDITOR";
      return session;
    },
  },
});
