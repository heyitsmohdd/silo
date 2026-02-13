import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

// 1. Setup the Email Transporter 📧
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendWelcomeEmail(email: string) {
    const loginLink = `${process.env.APP_URL || 'http://localhost:5173'}/register`;

    const mailOptions = {
        from: `"Silo Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🚀 You're in! Access to Silo Granted",
        html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Welcome to Silo.</h2>
        <p>Your request has been approved.</p>
        <p>You can now create your account and set your password.</p>
        <br>
        <a href="${loginLink}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Create Account</a>
        <br><br>
        <p style="color: #666; font-size: 12px;">Welcome to the chaos.</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${email}`);
    } catch (error) {
        console.error(`❌ Failed to send email to ${email}:`, error);
    }
}

async function main() {
    const emailToApprove = process.argv[2];

    if (!emailToApprove) {
        console.log("❌ Usage: npx tsx scripts/approve.ts user@example.com");
        return;
    }

    // Check if they exist in requests
    const request = await prisma.accessRequest.findUnique({
        where: { email: emailToApprove },
    });

    if (!request) {
        console.log(`⚠️  ${emailToApprove} is not in the waitlist.`);
        // We proceed anyway just in case you want to manually add someone
    }

    // 1. Database Transaction (Approve User)
    try {
        await prisma.allowedEmail.create({
            data: { email: emailToApprove },
        });
        console.log(`✅ Database: ${emailToApprove} is now ALLOWED.`);

        // 2. Clean up Waitlist
        if (request) {
            await prisma.accessRequest.delete({
                where: { email: emailToApprove },
            });
        }

        // 3. SEND THE EMAIL 📨
        console.log("...Sending notification...");
        await sendWelcomeEmail(emailToApprove);

    } catch (e) {
        console.log(`⚠️  User already allowed or error:`, e);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
