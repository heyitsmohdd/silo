import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteDefaultChannels() {
    console.log('🗑️  Deleting default channels...');

    const defaultChannels = ['general', 'coding', 'random', 'announcements'];

    for (const channelName of defaultChannels) {
        try {
            const deleted = await prisma.channel.deleteMany({
                where: { name: channelName },
            });
            console.log(`✅ Deleted channel: #${channelName} (${deleted.count} records)`);
        } catch (error) {
            console.error(`❌ Error deleting #${channelName}:`, error);
        }
    }

    console.log('✨ Cleanup complete!');
}

deleteDefaultChannels()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
