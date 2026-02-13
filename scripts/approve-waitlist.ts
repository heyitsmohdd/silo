import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

// 1. Setup Email Transporter 📧
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendWelcomeEmail(email: string) {
    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    const registerLink = `${appUrl}/register`;

    const mailOptions = {
        from: `"Silo Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🚀 You're in! Access to Silo Granted",
        html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #000;">Welcome to Silo.</h2>
        <p>Your request has been approved.</p>
        <p>You can now create your account and join your batch.</p>
        <br>
        <a href="${registerLink}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Create Account</a>
        <br><br>
        <p style="color: #666; font-size: 12px;">Welcome to the chaos.</p>
        <p style="color: #aaa; font-size: 10px; margin-top: 20px;">Ref: ${new Date().getTime().toString(36)}</p>
      </div>
    `,
    };

    return transporter.sendMail(mailOptions);
}

async function approveWaitlist() {
    console.log('🔄 Fetching pending access requests...');

    // Get all pending requests
    const pendingRequests = await prisma.accessRequest.findMany({
        where: { status: 'PENDING' },
    });

    console.log(`📋 Found ${pendingRequests.length} pending requests.`);

    if (pendingRequests.length === 0) {
        console.log('✅ No pending requests to approve.');
        return;
    }

    let approvedCount = 0;
    let emailCount = 0;

    for (const request of pendingRequests) {
        try {
            // 1. Add to AllowedEmail (Whitelist)
            await prisma.allowedEmail.upsert({
                where: { email: request.email },
                create: { email: request.email },
                update: {}, // No-op if exists
            });

            // 2. Remove from AccessRequest (Move to Allowed)
            await prisma.accessRequest.delete({
                where: { id: request.id },
            });

            console.log(`✅ Approved DB: ${request.email}`);
            approvedCount++;

            // 3. Send Email 📧
            try {
                process.stdout.write(`   ...Sending email to ${request.email}... `);
                await sendWelcomeEmail(request.email);
                console.log('✅ Sent!');
                emailCount++;
                // Small delay to be nice to Gmail API
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (emailError) {
                console.error(`❌ Email Failed:`, emailError);
            }

        } catch (error) {
            console.error(`❌ Failed to process ${request.email}:`, error);
        }
    }

    console.log(`\n🎉 Bulk approval complete!`);
    console.log(`   - Whitelisted: ${approvedCount}`);
    console.log(`   - Emails Sent: ${emailCount}`);
}

approveWaitlist()
    .catch((e) => {
        console.error('Fatal Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
