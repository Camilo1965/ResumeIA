import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { databaseClient } from './prisma';

// Resume AI Authentication Configuration
export const resumeAIAuthConfiguration: NextAuthOptions = {
  adapter: PrismaAdapter(databaseClient!) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      id: 'resumeai-login',
      name: 'Resume AI Email',
      credentials: {
        emailAddress: { label: 'Email', type: 'email' },
        userPassword: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.emailAddress || !credentials?.userPassword || !databaseClient) {
          return null;
        }

        const userAccount = await databaseClient.authenticatedUser.findUnique({
          where: { emailAddress: credentials.emailAddress },
        });

        if (!userAccount?.hashedPassword) {
          return null;
        }

        const passwordIsCorrect = await bcrypt.compare(
          credentials.userPassword,
          userAccount.hashedPassword
        );

        if (!passwordIsCorrect) {
          return null;
        }

        return {
          id: userAccount.userId,
          email: userAccount.emailAddress,
          name: userAccount.fullName || '',
          image: userAccount.avatarImageUrl || '',
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 2592000,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.resumeUID = user.id;
        token.resumeEmail = user.email;
        token.resumeName = user.name;
        token.resumePicture = user.image;
      }
      if (account) {
        token.resumeProvider = account.provider;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.resumeUID as string;
        session.user.email = token.resumeEmail as string;
        session.user.name = token.resumeName as string;
        session.user.image = token.resumePicture as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
