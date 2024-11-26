import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import { getUserAuth } from '@/app/lib/actions';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6), rememberMe: z.boolean() })
          .safeParse({
            ...credentials,
            rememberMe: credentials.rememberMe === 'true',
          });

        if (!parsedCredentials.success) {
          console.error('Invalid credentials format:', parsedCredentials.error);
          return null;
        }

        try {
          const { email, password, rememberMe } = parsedCredentials.data;
          const user = await getUserAuth(email, password, rememberMe);
          if (user) {
            return { ...user};
          } else {
            console.log('Invalid credentials');
            return null;
          }

        } catch (error) {
          console.error('Error in authorize function:', error);
          return null;
        }
      },
    }),
  ],
  logger: {
    error(error) {
      console.error('[auth][error]', error);
    },
    warn(warning) {
      console.warn('[auth][warn]', warning);
    },
    debug(message) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[auth][debug]', message);
      }
    },
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        //token.rememberMe = user.rememberMe || false; 
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user = token.user as User
      return session;
    },
    async redirect({ url, baseUrl }) {
      const nextAuthBaseUrl = process.env.NEXTAUTH_URL || baseUrl;
      const callbackUrl = new URL(url).searchParams.get('callbackUrl');
      if (callbackUrl) {
        return callbackUrl;
      }
      if (url.startsWith("/")) return `${nextAuthBaseUrl}${url}`;
      else if (new URL(url).origin === nextAuthBaseUrl) return url;
      return nextAuthBaseUrl;
    },
  }
});