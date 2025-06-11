import nodemailer from 'nodemailer';

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
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} for subject: ${subject}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};
