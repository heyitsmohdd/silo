
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const email = "nalawadeprathmesh24@gmail.com";

    console.log(`Checking for user: ${email}`);

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        console.log("User in User table:", user);

        const allowed = await prisma.allowedEmail.findUnique({ where: { email } });
        console.log("User in AllowedEmail table:", allowed);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
