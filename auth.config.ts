import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      const callbackUrl = nextUrl.searchParams.get('callbackUrl');

      // if (isOnDashboard) {
      //   if (isLoggedIn) return true;
      //   return false; // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   if (callbackUrl) {
      //     return Response.redirect(new URL(callbackUrl, nextUrl));
      //   }
      //   return Response.redirect(new URL('/', nextUrl));
      // }

      if (!isLoggedIn) {
        if (isOnLogin) {
          return true;
        }
        return false;
      }else{
        if (callbackUrl) {
          return Response.redirect(new URL(callbackUrl, nextUrl));
        }
        
        if (isOnLogin) {
          return Response.redirect(new URL('/', nextUrl));
        }
        
        return true;
      }
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;