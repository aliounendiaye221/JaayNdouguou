import type { NextAuthConfig } from 'next-auth';

const isProduction = process.env.NODE_ENV === 'production';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [], // Configured in auth.ts
    // IMPORTANT: Synchroniser les noms de cookies avec auth.ts
    // Sans ça, le middleware cherche "authjs.*" alors que auth.ts crée "next-auth.*"
    cookies: {
        sessionToken: {
            name: isProduction ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax' as const,
                path: '/',
                secure: isProduction,
            },
        },
        callbackUrl: {
            name: isProduction ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
            options: {
                httpOnly: false,
                sameSite: 'lax' as const,
                path: '/',
                secure: isProduction,
            },
        },
        csrfToken: {
            name: isProduction ? '__Secure-next-auth.csrf-token' : 'next-auth.csrf-token',
            options: {
                httpOnly: true,
                sameSite: 'lax' as const,
                path: '/',
                secure: isProduction,
            },
        },
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnApiAdmin = nextUrl.pathname.startsWith('/api/admin');
            const isOnLogin = nextUrl.pathname.startsWith('/login');

            // Protéger les routes admin ET les API admin
            if (isOnAdmin || isOnApiAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isOnLogin && isLoggedIn) {
                return Response.redirect(new URL('/admin/dashboard', nextUrl));
            }

            return true;
        },
    },
} satisfies NextAuthConfig;
