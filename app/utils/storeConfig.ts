import { prisma } from './prisma';
import { products as catalogProducts } from '@/app/data/products';

export interface StoreConfigData {
    id: string;
    deliveryFee: number;
    freeDeliveryThreshold: number;
    whatsappNumber: string;
    storeOpen: boolean;
    announcementMessage: string | null;
    updatedAt?: Date;
}

export const DEFAULT_STORE_CONFIG: StoreConfigData = {
    id: 'default',
    deliveryFee: 1500,
    freeDeliveryThreshold: 10000,
    whatsappNumber: '+221786037913',
    storeOpen: true,
    announcementMessage: 'Livraison rapide en 2h à Dakar et Rufisque !',
};

/**
 * Récupère la configuration actuelle de la boutique (frais de livraison, seuil, etc.)
 * Si la configuration n'existe pas encore en base, elle est créée avec les valeurs par défaut.
 */
export async function getStoreConfig(): Promise<StoreConfigData> {
    try {
        if ((prisma as any).storeConfig) {
            let config = await (prisma as any).storeConfig.findUnique({
                where: { id: 'default' },
            });

            if (!config) {
                config = await (prisma as any).storeConfig.create({
                    data: DEFAULT_STORE_CONFIG,
                });
            }

            return {
                id: config.id,
                deliveryFee: Number(config.deliveryFee),
                freeDeliveryThreshold: Number(config.freeDeliveryThreshold),
                whatsappNumber: config.whatsappNumber,
                storeOpen: Boolean(config.storeOpen),
                announcementMessage: config.announcementMessage,
                updatedAt: config.updatedAt,
            };
        }
    } catch (error) {
        console.warn('⚠️ [STORE_CONFIG] Impossible de lire StoreConfig en base, repli sur les valeurs par défaut:', error);
    }

    return DEFAULT_STORE_CONFIG;
}

/**
 * Met à jour la configuration de la boutique
 */
export async function updateStoreConfig(data: Partial<Omit<StoreConfigData, 'id' | 'updatedAt'>>): Promise<StoreConfigData> {
    try {
        if ((prisma as any).storeConfig) {
            const updated = await (prisma as any).storeConfig.upsert({
                where: { id: 'default' },
                update: data,
                create: {
                    ...DEFAULT_STORE_CONFIG,
                    ...data,
                },
            });

            return {
                id: updated.id,
                deliveryFee: Number(updated.deliveryFee),
                freeDeliveryThreshold: Number(updated.freeDeliveryThreshold),
                whatsappNumber: updated.whatsappNumber,
                storeOpen: Boolean(updated.storeOpen),
                announcementMessage: updated.announcementMessage,
                updatedAt: updated.updatedAt,
            };
        }
    } catch (error) {
        console.error('❌ [STORE_CONFIG] Erreur lors de la mise à jour de la configuration:', error);
        throw error;
    }

    return { ...DEFAULT_STORE_CONFIG, ...data };
}

/**
 * S'assure que les produits de base sont initialisés en base de données.
 * Si un produit du catalogue statique manque en base, il est inséré avec son stock initial.
 */
export async function ensureProductsInitialized() {
    try {
        const count = await prisma.product.count();
        if (count < catalogProducts.length) {
            for (const item of catalogProducts) {
                await prisma.product.upsert({
                    where: { id: item.id },
                    update: {}, // Ne pas écraser les prix si le produit existe déjà
                    create: {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        unit: item.unit,
                        image: item.image || '',
                        category: item.category || 'Général',
                        description: item.description || '',
                        stock: 100,
                        isAvailable: true,
                    },
                });
            }
        }
    } catch (error) {
        console.warn('⚠️ [STORE_CONFIG] Impossible d\'initialiser les produits en base:', error);
    }
}
