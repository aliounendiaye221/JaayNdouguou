import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [], // Configured in auth.ts
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnLogin = nextUrl.pathname.startsWith('/login');

            if (isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isOnLogin && isLoggedIn) {
                return Response.redirect(new URL('/admin/dashboard', nextUrl));
            }

            return true;
        },
    },
} satisfies NextAuthConfig;
