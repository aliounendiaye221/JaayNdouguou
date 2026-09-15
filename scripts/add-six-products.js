const fs = require('fs');
const path = require('path');

// Manually load .env if process.env.DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const match = trimmed.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    let val = match[2].trim();
                    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                        val = val.substring(1, val.length - 1);
                    }
                    process.env[key] = val;
                }
            }
        });
    }
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const srcDir = 'C:\\Users\\aliou\\.gemini\\antigravity-ide\\brain\\2e83725d-f852-4c01-ab54-0ebd7acd3de1';
const pubDir = path.join(process.cwd(), 'public');

const imageCopies = [
    { src: 'fresh_sweet_potato_1789514317136.jpg', dests: ['patate.png', 'patate-douce.png'] },
    { src: 'fresh_green_limon_1789514343077.jpg', dests: ['limon.png'] },
    { src: 'fresh_green_courgette_1789514357299.jpg', dests: ['courgette.png'] },
    { src: 'red_hibiscus_bissap_1789514375879.jpg', dests: ['hibiscus.png', 'bissap.png'] },
    { src: 'african_bitter_eggplant_1789514391373.jpg', dests: ['aubergine-amere.png', 'jaxatu.png'] },
    { src: 'baobab_bouye_fruit_1789514407609.jpg', dests: ['pain-de-singe.png', 'bouye.png'] }
];

const newProducts = [
    {
        id: "patate-douce",
        name: "Patate Douce",
        price: 600,
        unit: "kg",
        image: "/patate.png",
        category: "Tubercules",
        description: "Patates douces locales fraîches, riches en vitamines et savoureuses.",
        stock: 100,
        isAvailable: true
    },
    {
        id: "limon",
        name: "Limon (Citron Vert)",
        price: 1000,
        unit: "kg",
        image: "/limon.png",
        category: "Fruits",
        description: "Petits limons verts locaux très juteux et parfumés pour vos assaisonnements et jus.",
        stock: 100,
        isAvailable: true
    },
    {
        id: "courgette",
        name: "Courgette",
        price: 700,
        unit: "kg",
        image: "/courgette.png",
        category: "Légumes",
        description: "Courgettes fraîches et fermes, idéales pour vos sautés et ragoûts.",
        stock: 100,
        isAvailable: true
    },
    {
        id: "hibiscus",
        name: "Hibiscus (Bissap)",
        price: 1200,
        unit: "kg",
        image: "/hibiscus.png",
        category: "Épices",
        description: "Fleurs d'hibiscus séchées de qualité supérieure pour un bissap rouge intense et rafraîchissant.",
        stock: 100,
        isAvailable: true
    },
    {
        id: "aubergine-amere",
        name: "Aubergine Amère (Jaxatu)",
        price: 500,
        unit: "kg",
        image: "/aubergine-amere.png",
        category: "Légumes",
        description: "Aubergines amères (Jaxatu / Diakhatou) fraîches, indispensables pour un authentique Thiéboudienne.",
        stock: 100,
        isAvailable: true
    },
    {
        id: "pain-de-singe",
        name: "Pain de Singe (Bouye)",
        price: 1500,
        unit: "kg",
        image: "/pain-de-singe.png",
        category: "Fruits",
        description: "Fruit du baobab (Bouye) 100% naturel, riche en calcium et vitamine C pour de délicieux jus onctueux.",
        stock: 100,
        isAvailable: true
    }
];

async function main() {
    console.log('=== 1. COPIE DES IMAGES GÉNÉRÉES DANS /public ===');
    for (const item of imageCopies) {
        const srcPath = path.join(srcDir, item.src);
        if (!fs.existsSync(srcPath)) {
            console.error(`Fichier source introuvable: ${srcPath}`);
            continue;
        }
        const data = fs.readFileSync(srcPath);
        for (const dest of item.dests) {
            const destPath = path.join(pubDir, dest);
            fs.writeFileSync(destPath, data);
            console.log(`✓ Image copiée: ${dest} (${(data.length / 1024).toFixed(1)} KB)`);
        }
    }

    console.log('\n=== 2. INSERTION / MISE À JOUR DANS LA BASE DE DONNÉES (PRISMA) ===');
    for (const prod of newProducts) {
        const upserted = await prisma.product.upsert({
            where: { id: prod.id },
            update: {
                name: prod.name,
                price: prod.price,
                unit: prod.unit,
                image: prod.image,
                category: prod.category,
                description: prod.description,
                stock: prod.stock,
                isAvailable: prod.isAvailable
            },
            create: {
                id: prod.id,
                name: prod.name,
                price: prod.price,
                unit: prod.unit,
                image: prod.image,
                category: prod.category,
                description: prod.description,
                stock: prod.stock,
                isAvailable: prod.isAvailable
            }
        });
        console.log(`✓ Produit DB: [${upserted.id}] ${upserted.name} - ${upserted.price} FCFA / ${upserted.unit} (${upserted.category})`);
    }

    const totalCount = await prisma.product.count();
    console.log(`\n🎉 SUCCÈS TOTAL: ${totalCount} produits désormais dans la base de données !`);
}

main()
    .catch((err) => {
        console.error('❌ Erreur:', err.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
