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

async function main() {
    const emailToSend = process.argv[2];

    if (!emailToSend) {
        console.log("❌ Usage: npx tsx scripts/send-welcome.ts user@example.com");
        return;
    }

    // 1. Verify they are actually allowed (Optional safety check)
    const allowedUser = await prisma.allowedEmail.findUnique({
        where: { email: emailToSend },
    });

    if (!allowedUser) {
        console.log(`⚠️  Warning: ${emailToSend} is NOT in the Allowed Database.`);
        console.log("...Sending email anyway (assuming you know what you are doing)...");
    } else {
        console.log(`✅ Verified: ${emailToSend} is in the Allowed List.`);
    }

    const appUrl = process.env.APP_URL || 'http://localhost:5173';

    // 2. Prepare Email
    const mailOptions = {
        from: `"Silo Team" <${process.env.EMAIL_USER}>`,
        to: emailToSend,
        subject: "🚀 You're in! Access to Silo Granted",
        html: `
      <div style="font-family: sans-serif; padding: 20px;">
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
    };

    // 3. Send
    try {
        console.log(`...Sending welcome email to ${emailToSend}...`);
        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent successfully to ${emailToSend}`);
    } catch (error) {
        console.error(`❌ Failed to send email:`, error);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
