import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // List of allowed emails for beta access
    const allowedEmails = [
        'attarshariq50@gmail.com', // Your personal email
        'shariq@example.com',
        'student1@university.edu',
        'student2@university.edu',
        'professor@university.edu',
        'admin@university.edu',
    ];

    console.log(`📧 Adding ${allowedEmails.length} emails to whitelist...`);

    for (const email of allowedEmails) {
        await prisma.allowedEmail.upsert({
            where: { email },
            update: {},
            create: {
                email,
                addedBy: 'seed-script',
            },
        });
        console.log(`  ✅ ${email}`);
    }

    console.log('✨ Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
