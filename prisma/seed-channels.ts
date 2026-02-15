import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedChannels() {
    console.log('🌱 Seeding default channels...');

    const channels = [
        {
            name: 'general',
            description: 'General discussion for everyone',
            type: 'PUBLIC' as const,
            isDefault: true,
        },
        {
            name: 'coding',
            description: 'Programming help and code discussions',
            type: 'PUBLIC' as const,
            isDefault: true,
        },
        {
            name: 'random',
            description: 'Off-topic conversations and fun stuff',
            type: 'PUBLIC' as const,
            isDefault: true,
        },
        {
            name: 'announcements',
            description: 'Important updates and announcements',
            type: 'PUBLIC' as const,
            isDefault: true,
        },
    ];

    for (const channel of channels) {
        const existing = await prisma.channel.findUnique({
            where: { name: channel.name },
        });

        if (!existing) {
            await prisma.channel.create({
                data: channel,
            });
            console.log(`✅ Created channel: #${channel.name}`);
        } else {
            // Update existing channels to be default
            await prisma.channel.update({
                where: { name: channel.name },
                data: { isDefault: true },
            });
            console.log(`⏭️  Channel already exists: #${channel.name} (marked as default)`);
        }
    }

    console.log('✨ Channel seeding complete!');
}

seedChannels()
    .catch((e) => {
        console.error('❌ Error seeding channels:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
