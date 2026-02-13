import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'attarshariq50@gmail.com';
    console.log(`Checking status for: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    const allowed = await prisma.allowedEmail.findUnique({
        where: { email },
    });

    console.log('--- USER TABLE ---');
    console.log(user ? user : 'User NOT found in DB');

    console.log('\n--- ALLOWED EMAIL TABLE ---');
    console.log(allowed ? allowed : 'User NOT in Allowed List');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
