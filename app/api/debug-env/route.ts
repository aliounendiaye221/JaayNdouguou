import { NextResponse } from 'next/server';
import { testDatabaseConnection, verifyDatabaseSource, getDbInfo } from '@/app/utils/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

/**
 * API de diagnostic pour vérifier la configuration de l'environnement
 * PROTÉGÉE par authentification admin
 * 
 * Utilisation: GET /api/debug-env
 */
export async function GET(request: Request) {
    // Protection: Seuls les admins authentifiés peuvent accéder
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const includeDbTest = searchParams.get('test') !== 'false';

        // Informations de base sur l'environnement
        const envInfo = {
            // Environnement Next.js / Vercel
            NODE_ENV: process.env.NODE_ENV,
            VERCEL_ENV: process.env.VERCEL_ENV || 'local',
            VERCEL_URL: process.env.VERCEL_URL || 'non défini',
            VERCEL_REGION: process.env.VERCEL_REGION || 'non défini',
            
            // Configuration Auth
            NEXTAUTH_URL: process.env.NEXTAUTH_URL?.replace(/^(https?:\/\/[^/]+).*/, '$1') || 'NON CONFIGURÉ',
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Configuré' : '❌ Manquant',
            
            // Site
            NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL?.replace(/^(https?:\/\/[^/]+).*/, '$1') || 'NON CONFIGURÉ',
            NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'NON CONFIGURÉ',
            
            // Base de données (info partielle pour sécurité)
            DATABASE_URL: process.env.DATABASE_URL ? '✅ Configuré' : '❌ Manquant',
            DIRECT_URL: process.env.DIRECT_URL ? '✅ Configuré' : '⚠️ Manquant (recommandé)',
        };

        // Informations détaillées sur la DB
        const dbInfo = getDbInfo();

        // Test de connexion optionnel
        let connectionTest = null;
        let dbVerification = null;
        
        if (includeDbTest) {
            connectionTest = await testDatabaseConnection();
            if (connectionTest.connected) {
                dbVerification = await verifyDatabaseSource();
            }
        }

        // Timestamp pour validation
        const timestamp = new Date().toISOString();

        const response = NextResponse.json({
            success: true,
            timestamp,
            session: {
                user: session.user?.email,
                authenticated: true,
            },
            environment: envInfo,
            database: {
                info: {
                    host: dbInfo.main?.host || 'non configuré',
                    database: dbInfo.main?.database || 'non configuré',
                    pgBouncer: dbInfo.main?.hasPgBouncer ? 'activé' : 'désactivé',
                    ssl: dbInfo.main?.hasSSL ? 'activé' : 'désactivé',
                    directUrlConfigured: dbInfo.hasDirectUrl,
                },
                connectionTest,
                verification: dbVerification,
            },
            checks: {
                // Vérifications critiques
                isProduction: process.env.NODE_ENV === 'production',
                isVercelProduction: process.env.VERCEL_ENV === 'production',
                hasSecretConfigured: !!process.env.NEXTAUTH_SECRET,
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                hasCorrectAuthUrl: process.env.NEXTAUTH_URL?.includes('jaayndougou.app') || false,
                hasPgBouncer: dbInfo.main?.hasPgBouncer || false,
            },
            recommendations: generateRecommendations(envInfo, dbInfo, connectionTest),
        });

        response.headers.set('Cache-Control', 'no-store');
        return response;

    } catch (error) {
        console.error('❌ [DEBUG-ENV] Erreur:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}

function generateRecommendations(
    envInfo: Record<string, string>,
    dbInfo: ReturnType<typeof getDbInfo>,
    connectionTest: any
): string[] {
    const recommendations: string[] = [];

    if (envInfo.NEXTAUTH_SECRET === '❌ Manquant') {
        recommendations.push('🔴 CRITIQUE: NEXTAUTH_SECRET non configuré');
    }

    if (envInfo.DATABASE_URL === '❌ Manquant') {
        recommendations.push('🔴 CRITIQUE: DATABASE_URL non configuré');
    }

    if (!dbInfo.hasDirectUrl) {
        recommendations.push('⚠️ DIRECT_URL non configuré - nécessaire pour les migrations Prisma');
    }

    if (!dbInfo.main?.hasPgBouncer) {
        recommendations.push('⚠️ PgBouncer non activé - recommandé pour Neon sur Vercel');
    }

    if (envInfo.NEXTAUTH_URL.includes('localhost')) {
        recommendations.push('🔴 CRITIQUE: NEXTAUTH_URL contient localhost - doit être https://jaayndougou.app');
    }

    if (connectionTest && !connectionTest.connected) {
        recommendations.push(`🔴 CRITIQUE: Connexion DB échouée - ${connectionTest.error}`);
    }

    if (connectionTest?.latency && connectionTest.latency > 500) {
        recommendations.push(`⚠️ Latence DB élevée: ${connectionTest.latency}ms`);
    }

    if (recommendations.length === 0) {
        recommendations.push('✅ Toutes les vérifications passées');
    }

    return recommendations;
}
