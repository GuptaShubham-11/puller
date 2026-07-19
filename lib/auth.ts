import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { eq } from "drizzle-orm";

import { env } from "./env";
import { db } from "./database";
import { users } from "./database/schema";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,

            async profile(profile) {
                return {
                    id: profile.sub,
                    email: profile.email,
                    name: profile.name,
                    image: profile.picture,
                };
            },
        }),
    ],

    callbacks: {
        async signIn({ user }) {
            const email = user.email!.toLowerCase();

            const existing = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

            if (existing.length === 0) {
                const [created] = await db
                    .insert(users)
                    .values({
                        email,
                        provider: "google",
                        credits: 10,
                        ip: "",
                    })
                    .returning();

                user.id = created.id;
            } else {
                await db
                    .update(users)
                    .set({
                        updatedAt: new Date(),
                    })
                    .where(eq(users.id, existing[0].id));

                user.id = existing[0].id;
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
            }

            return session;
        },
    },

    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },

    session: {
        strategy: "jwt",
        maxAge: 20 * 24 * 60 * 60,
    },

    secret: env.NEXTAUTH_SECRET,
};