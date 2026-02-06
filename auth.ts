import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { prisma, getDbInfo } from '@/app/utils/prisma';
import bcrypt from 'bcryptjs';

// Détection du domaine de production
const PRODUCTION_DOMAIN = 'jaayndougou.app';
const isProduction = process.env.NODE_ENV === 'production';

// Fonction pour déterminer si on est sur le domaine personnalisé ou Vercel
// Note: En production, on ne peut pas savoir à l'avance donc on configure pour le domaine personnalisé
const getCookieDomain = () => {
    // Sur domaine .app, on utilise le domaine avec point pour couvrir les sous-domaines
    // Sur vercel.app, les cookies fonctionnent sans domaine explicite
    if (isProduction) {
        // Utiliser le domaine uniquement pour jaayndougou.app
        // Vercel.app fonctionne automatiquement sans domaine
        return `.${PRODUCTION_DOMAIN}`;
    }
    return undefined;
};

async function getUser(email: string) {
    try {
        console.log(`🔐 [AUTH] Recherche utilisateur: ${email}`);
        console.log(`📊 [AUTH] DB Info:`, getDbInfo());
        
        const user = await prisma.admin.findUnique({ where: { email } });
        
        if (user) {
            console.log(`✅ [AUTH] Utilisateur trouvé: ${user.email} (role: ${user.role})`);
        } else {
            console.log(`❌ [AUTH] Utilisateur non trouvé: ${email}`);
        }
        
        return user;
    } catch (error) {
        console.error('❌ [AUTH] Erreur lors de la recherche utilisateur:', error);
        return null;
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true, // CRITIQUE: Permet tous les hosts (y compris domaine personnalisé)
    
    // Configuration des cookies CORRIGÉE pour domaine .app + mobile
    // IMPORTANT: __Host- prefix ne permet PAS de domaine personnalisé
    // On utilise __Secure- partout en production
    cookies: {
        sessionToken: {
            name: isProduction ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax', // Lax pour permettre navigation normale
                path: '/',
                secure: isProduction, // true en production (HTTPS requis pour .app)
                // IMPORTANT: Ne pas définir domaine pour compatibilité Vercel + domaine perso
                // Le navigateur gère automatiquement
            },
        },
        callbackUrl: {
            name: isProduction ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
            options: {
                httpOnly: false,
                sameSite: 'lax',
                path: '/',
                secure: isProduction,
            },
        },
        csrfToken: {
            // CORRECTION CRITIQUE: Ne PAS utiliser __Host- car incompatible avec domaine personnalisé
            // __Host- requiert: path="/", secure=true, ET pas de domaine (uniquement origin exacte)
            // Cela peut bloquer les requêtes cross-origin légitimes
            name: isProduction ? '__Secure-next-auth.csrf-token' : 'next-auth.csrf-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: isProduction,
            },
        },
    },
    
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 jours
        updateAge: 24 * 60 * 60, // Mise à jour toutes les 24h
    },
    
    debug: !isProduction,
    
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    console.log('🔐 [AUTH] Tentative de connexion...');
                    
                    const parsedCredentials = z
                        .object({ email: z.string().email(), password: z.string().min(6) })
                        .safeParse(credentials);

                    if (!parsedCredentials.success) {
                        console.error('❌ [AUTH] Format des identifiants invalide');
                        return null;
                    }

                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    
                    if (!user) {
                        console.error(`❌ [AUTH] Utilisateur non trouvé: ${email}`);
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    
                    if (!passwordsMatch) {
                        console.error(`❌ [AUTH] Mot de passe incorrect pour: ${email}`);
                        return null;
                    }

                    console.log(`✅ [AUTH] Connexion réussie pour: ${email}`);
                    
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    };
                } catch (error) {
                    console.error('❌ [AUTH] Erreur d\'autorisation:', error);
                    return null;
                }
            },
        }),
    ],
    
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
});
