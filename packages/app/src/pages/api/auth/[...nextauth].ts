import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

import { supabase } from "@/lib/supabase";

const maxAge = 30 * 24 * 60;

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const siweProvider = CredentialsProvider({
    name: "SIWE",
    credentials: {
      message: {
        label: "Message",
        type: "text",
        placeholder: "0x0",
      },
      signature: {
        label: "Signature",
        type: "text",
        placeholder: "0x0",
      },
    },
    async authorize(credentials) {
      try {
        if (!credentials) {
          return null;
        }
        const siwe = new SiweMessage(JSON.parse(credentials.message));
        const nextAuthUrl = process.env.APP_URL;
        if (!nextAuthUrl) {
          return null;
        }
        const nextAuthHost = new URL(nextAuthUrl).host;
        if (siwe.domain !== nextAuthHost) {
          return null;
        }
        if (siwe.nonce !== (await getCsrfToken({ req }))) {
          return null;
        }
        await siwe.validate(credentials.signature);
        const address = siwe.address.toLowerCase();
        return {
          address,
          type: "evm",
        };
      } catch (e) {
        return null;
      }
    },
  });

  const nextAuth = NextAuth(req, res, {
    providers: [siweProvider],
    session: {
      strategy: "jwt",
      maxAge,
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async signIn({ user }) {
        const { address, type } = user;
        let { data: walletIdentitiyRecord } = await supabase
          .from("wallet_identities")
          .select("*")
          .eq("address", address)
          .eq("type", type)
          .single();
        if (!walletIdentitiyRecord) {
          const { data: created } = await supabase.from("wallet_identities").insert({ address, type });
          walletIdentitiyRecord = created;
        }
        const token = jwt.sign(
          {
            sub: walletIdentitiyRecord.id,
            aud: "authenticated",
            role: "authenticated",
            expiresIn: maxAge,
          },
          process.env.SUPABASE_JWT_SECRET || ""
        );
        await supabase.auth.setAuth(token);
        return true;
      },
      async jwt({ token, user }) {
        return { ...token, ...user };
      },

      async session({ session, token }) {
        session.user = {
          ...session.user,
          ...token,
        };
        return session;
      },
    },
  });
  return nextAuth;
};

export default handler;
