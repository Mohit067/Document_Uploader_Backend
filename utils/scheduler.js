import cron from 'cron';
import Document from '../models/Document.js';
import User from '../models/User.js';
import { sendEmail } from './emailService.js';

const startScheduler = () => {
    // Schedule to run every day at 9:00 AM
    new cron.CronJob('0 9 * * *', async () => {
        console.log('Running daily deadline reminder check...');
        try {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            // Find documents with deadline in next 24 hours
            const upcomingDocuments = await Document.find({
                deadline: { $gte: today, $lte: tomorrow }
            }).populate('userId', 'email');

            for (const doc of upcomingDocuments) {
                if (doc.userId?.email) {
                    const subject = `Reminder: Document Deadline Approaching for "${doc.name}"`;
                    const htmlContent = `
                        <p>Dear Client,</p>
                        <p>This is a reminder that your document "${doc.name}" of type "${doc.type}" has a deadline approaching on <strong>${new Date(doc.deadline).toLocaleDateString()}</strong>.</p>
                        <p>Please ensure all necessary actions are taken.</p>
                        <p>Thank you,</p>
                        <p>Whitecircle Group</p>
                    `;
                    await sendEmail(doc.userId.email, subject, htmlContent);
                }
            }

            console.log(`Sent ${upcomingDocuments.length} deadline reminders.`);
        } catch (error) {
            console.error('Error in daily reminder scheduler:', error);
        }
    }, null, true, 'Asia/Kolkata');
};

export { startScheduler };
