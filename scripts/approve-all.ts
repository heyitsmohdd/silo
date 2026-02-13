import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
const prisma = new PrismaClient();

// 1. Setup Gmail Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function main() {
    console.log("🚀 Starting Bulk Approval Process...");

    // 2. Fetch ALL pending requests
    const pendingRequests = await prisma.accessRequest.findMany();

    if (pendingRequests.length === 0) {
        console.log("🤷♂️ No pending requests found. The waitlist is empty.");
        return;
    }

    console.log(`📋 Found ${pendingRequests.length} users waiting. Processing...`);

    // 3. Loop through each user
    for (const request of pendingRequests) {
        const email = request.email;
        console.log(`\n🔹 Processing: ${email}...`);

        try {
            // Step A: Database Transaction (Move to Allowed, Remove from Waitlist)
            // We use a transaction to ensure both happen or neither happens
            await prisma.$transaction(async (tx) => {
                // 1. Add to AllowedEmail
                // Note: We use upsert or ignore in case they are already allowed
                const exists = await tx.allowedEmail.findUnique({ where: { email } });
                if (!exists) {
                    await tx.allowedEmail.create({ data: { email } });
                }

                // 2. Delete from AccessRequest
                await tx.accessRequest.delete({ where: { email } });
            });

            console.log(`   ✅ Database: User moved to Allowed List.`);

            // Step B: Send the Welcome Email
            const appUrl = process.env.APP_URL || 'http://localhost:5173';

            await transporter.sendMail({
                from: `"Silo Team" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "🚀 You're in! Access to Silo Granted",
                html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>Welcome to Silo.</h2>
            <p>Your request has been approved.</p>
            <p>You can now create your account and set your password.</p>
            <br>
            <a href="${appUrl}/register" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Create Account</a>
            <br><br>
            <p style="color: #666; font-size: 12px;">Welcome to the chaos.</p>
            <p style="color: #aaa; font-size: 10px; margin-top: 20px;">Ref: ${new Date().getTime().toString(36)}</p>
          </div>
        `,
            });

            console.log(`   📧 Email: Sent successfully!`);

        } catch (error) {
            console.error(`   ❌ FAILED to process ${email}:`, error);
            // We continue to the next user even if this one fails
        }
    }

    console.log(`\n✨ DONE. Batch processing complete.`);
}

main()
    .catch((e) => console.error("Critical Script Error:", e))
    .finally(async () => await prisma.$disconnect());
