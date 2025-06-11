import dotenv from 'dotenv';
dotenv.config(); // ✅ Load env variables from .env file

import nodemailer from 'nodemailer';

// 🔍 Debug log to check if ENV variables are loading correctly
console.log('📧 Email ENV:', process.env.EMAIL_USER, process.env.EMAIL_PASS ? '✅ Exists' : '❌ Missing');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"Whitecircle Group" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    };
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to} for subject: ${subject}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error);
  }
};
