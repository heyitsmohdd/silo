import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteCodeChannel() {
    console.log('🗑️  Deleting "code" channel...');

    try {
        const deleted = await prisma.channel.deleteMany({
            where: { name: 'code' },
        });
        console.log(`✅ Deleted channel: #code (${deleted.count} records)`);
    } catch (error) {
        console.error('❌ Error deleting #code:', error);
    }

    console.log('✨ Cleanup complete!');
}

deleteCodeChannel()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
