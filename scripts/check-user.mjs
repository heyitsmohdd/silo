import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const email = 'attarshariq50@gmail.com';
    console.log(`Checking status for: ${email}`);

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        const allowed = await prisma.allowedEmail.findUnique({
            where: { email },
        });

        console.log('--- USER TABLE ---');
        console.log(user ? JSON.stringify(user, null, 2) : 'User NOT found in DB');

        console.log('\n--- ALLOWED EMAIL TABLE ---');
        console.log(allowed ? JSON.stringify(allowed, null, 2) : 'User NOT in Allowed List');
    } catch (e) {
        console.error("Query failed", e);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
