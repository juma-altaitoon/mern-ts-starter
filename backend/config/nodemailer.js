/**
 * Nodemailer configuration file
 */

import nodemailer from 'nodemailer';
import logger from '../middleware/logger.js';

/**
 * Create a transporter object using SMTP transport
 * @param {string} host - SMTP provider (Gmail, Outlook, etc...)
 * @param {number} port - SMTP port (default: 587)
 * @param {boolean} secure - true for 465, false for other ports
 * @param {object} auth - authentication object containing user and pass
 * @param {object} tls - object containing TLS options (rejectUnauthorized: false to allow self-signed certificates)
 * @returns {object} transporter - Nodemailer transporter object
 */
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
 * @returns {object} info - Nodemailer info object containing messageId and response
 * @todo Add support for attachments and text body
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