import nodeMailer from 'nodemailer';
import { ADMIN_EMAIL, ADMIN_PASSWORD, MAIL_PORT, MAIL_HOST } from '../config/mailer.config';

export const sendMail = (to, subject, htmlContent) => {
    const transporter = nodeMailer.createTransport({
        host: MAIL_HOST,
        port: MAIL_PORT,
        secure: false,
        auth: {
            user: ADMIN_EMAIL,
            pass: ADMIN_PASSWORD
        }
    })
    const options = {
        from: ADMIN_EMAIL,
        to: to,
        subject: subject,
        html: htmlContent
    }
    return transporter.sendMail(options)
}