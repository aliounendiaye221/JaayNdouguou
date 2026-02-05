const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '../.env.local');
console.log('Loading env from:', envPath);
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=');
            const trimmedKey = key.trim();
            if (!trimmedKey.startsWith('#')) {
                process.env[trimmedKey] = value.trim().replace(/^["']|["']$/g, '');
                console.log('Loaded key:', trimmedKey);
            }
        }
    });
} else {
    console.log('Env file not found');
}

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@jaayndougou.sn';
    const password = process.env.INITIAL_ADMIN_PASSWORD || 'password123'; // Use env var in production!
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.admin.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Admin Principal',
            password: hashedPassword,
            role: 'super-admin',
        },
    });

    console.log({ user });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
