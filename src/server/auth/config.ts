/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthConfig } from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";
// import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";

export const authConfig: NextAuthConfig = {
  providers: [
    // DiscordProvider,
    // GoogleProvider,
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const email = credentials?.email;
        const password = credentials?.password;
      
        if (typeof email !== "string" || typeof password !== "string") {
          throw new Error("Missing email or password");
        }
      
        const res = await fetch(`https://16ty7qdrel.execute-api.ap-south-1.amazonaws.com/get-user-by-filter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filterKey : "email", filterValue : email }),
        });
      
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }     
        const user = await res.json();        

        if (!user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }
      
        const isValid = await bcrypt.compare(password, user.hashedPassword as string);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
      

    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name!;
        session.user.email = token.email!;
        session.user.image = token.picture!;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
