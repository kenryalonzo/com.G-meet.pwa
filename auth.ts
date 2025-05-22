import NextAuth from "next-auth"
import authConfig from "./auth.config"
 
// import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
 
// const db = new PrismaClient()
 
export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/sign-in",
        // signOut: "/sign-out",
        error: "/error",
    },

    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: new Date(),
                },
            })
        }
    },

    callbacks: {
        session({ session, token }) {
            if (token.id) {
                session.user.id = token.id as string
            }
            return session
        },
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})