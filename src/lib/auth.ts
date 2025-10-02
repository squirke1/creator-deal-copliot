import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { AuthConfig } from 'next-auth';

import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const authConfig: AuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ''
    })
  ],
  session: {
    strategy: 'database'
  },
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  },
  events: {
    signIn: async (message) => {
      logger.info({ event: 'auth.signIn', userId: message.user.id }, 'user signed in');
    }
  }
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth(authConfig);
