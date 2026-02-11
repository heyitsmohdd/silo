
import { PrismaClient } from '@prisma/client';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting username backfill...');

    // Find all users with null username
    const users = await prisma.user.findMany({
        where: {
            username: null,
        },
    });

    console.log(`Found ${users.length} users with null username.`);

    for (const user of users) {
        // Generate a unique username
        // We use a loop just in case we generate a collision, though unlikely with 2 words + ID check
        let username = '';
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 5) {
            attempts++;
            username = uniqueNamesGenerator({
                dictionaries: [adjectives, animals],
                separator: '-',
                style: 'capital',
                length: 2,
            });

            // Double check uniqueness in DB
            const existing = await prisma.user.findUnique({
                where: { username },
            });

            if (!existing) {
                isUnique = true;
            }
        }

        if (isUnique) {
            await prisma.user.update({
                where: { id: user.id },
                data: { username },
            });
            console.log(`Updated user ${user.email} -> ${username}`);
        } else {
            console.error(`Failed to generate unique username for ${user.email} after 5 attempts.`);
        }
    }

    console.log('Backfill complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
