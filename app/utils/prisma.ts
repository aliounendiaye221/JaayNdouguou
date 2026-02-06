import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Extraction des informations de connexion DB pour diagnostic
const getDatabaseInfo = () => {
    const dbUrl = process.env.DATABASE_URL || '';
    const directUrl = process.env.DIRECT_URL || '';
    
    // Parser l'URL pour extraire les infos (sans exposer le mot de passe)
    const parseDbUrl = (url: string) => {
        try {
            const match = url.match(/postgresql:\/\/([^:]+):[^@]+@([^/]+)\/([^?]+)/);
            if (match) {
                return {
                    user: match[1],
                    host: match[2],
                    database: match[3],
                    hasPgBouncer: url.includes('pgbouncer=true'),
                    hasSSL: url.includes('sslmode=require'),
                };
            }
        } catch (e) {}
        return null;
    };
    
    return {
        main: parseDbUrl(dbUrl),
        direct: parseDbUrl(directUrl),
        hasDirectUrl: !!directUrl,
        environment: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV || 'local',
    };
};

// Exporter les infos DB pour le diagnostic
export const getDbInfo = () => getDatabaseInfo();

// Log initial des infos de connexion (une seule fois au démarrage)
const dbInfo = getDatabaseInfo();
console.log('🔌 [PRISMA] Configuration de la base de données:');
console.log(`   - Host: ${dbInfo.main?.host || 'NON CONFIGURÉ'}`);
console.log(`   - Database: ${dbInfo.main?.database || 'NON CONFIGURÉ'}`);
console.log(`   - PgBouncer: ${dbInfo.main?.hasPgBouncer ? '✅ Activé' : '❌ Désactivé'}`);
console.log(`   - SSL: ${dbInfo.main?.hasSSL ? '✅ Activé' : '❌ Désactivé'}`);
console.log(`   - Environnement: ${dbInfo.environment} (Vercel: ${dbInfo.vercelEnv})`);
console.log(`   - DIRECT_URL: ${dbInfo.hasDirectUrl ? '✅ Configuré' : '⚠️ Non configuré'}`);

// Configuration optimisée pour Neon avec PgBouncer
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn'] 
        : ['error', 'warn'], // Garder warn en prod pour debug
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})

// Gestion de la connexion avec retry automatique (seulement au runtime)
if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    // Connexion automatique en production côté serveur
    prisma.$connect()
        .then(() => {
            console.log('✅ [PRISMA] Connexion à Neon établie avec succès');
        })
        .catch((err) => {
            console.error('❌ [PRISMA] Erreur de connexion:', err);
            // Retry dans 5 secondes
            setTimeout(() => {
                prisma.$connect()
                    .then(() => console.log('✅ [PRISMA] Reconnexion réussie'))
                    .catch(console.error);
            }, 5000);
        });
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Fonction utilitaire pour tester la connexion
export async function testDatabaseConnection(): Promise<{
    connected: boolean;
    latency?: number;
    error?: string;
    dbInfo: ReturnType<typeof getDatabaseInfo>;
}> {
    const start = Date.now();
    try {
        await prisma.$queryRaw`SELECT 1 as health_check`;
        const latency = Date.now() - start;
        return {
            connected: true,
            latency,
            dbInfo: getDatabaseInfo(),
        };
    } catch (error) {
        return {
            connected: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            dbInfo: getDatabaseInfo(),
        };
    }
}

// Fonction pour vérifier qu'on utilise bien la bonne base
export async function verifyDatabaseSource(): Promise<{
    source: string;
    ordersCount: number;
    customersCount: number;
    adminsCount: number;
    dbHost: string;
}> {
    const info = getDatabaseInfo();
    const [ordersCount, customersCount, adminsCount] = await Promise.all([
        prisma.order.count(),
        prisma.customer.count(),
        prisma.admin.count(),
    ]);
    
    return {
        source: info.vercelEnv === 'production' ? 'PRODUCTION' : info.vercelEnv.toUpperCase(),
        ordersCount,
        customersCount,
        adminsCount,
        dbHost: info.main?.host || 'unknown',
    };
}

export default prisma