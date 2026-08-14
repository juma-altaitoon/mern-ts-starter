// Sending emails in Node js using Nodemailer

import nodemailer from 'nodemailer';
import logger from '../middleware/logger.js';

// Transport using SMTP
const transporter =  nodemailer.createTransport({
    host: process.env.SMTP_HOST, //SMTP provider(Gmail, Outlook, etc...)
    port: process.env.SMTP_PORT || 587,
    tls: {
        rejectUnauthorized: false 
    },
    secure: process.env.NODE_ENV === "production",
    auth: {
        user: process.env.SMTP_USER, //Email Address
        pass: process.env.SMTP_USER,
    },
});

/** 
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {strinf} html - HTML body of the email
*/
export const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        logger.info(`${subject} email sent to <${to}>`, info.messageId);
        return info;
    } catch (error) {
        logger.error("Error sending email: ", error)
        throw new Error("Email could not be sent");
        
    }
};