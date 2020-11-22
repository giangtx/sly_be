import nodeMailer from "nodemailer";

const { ADMIN_EMAIL, ADMIN_PASSWORD, MAIL_PORT, MAIL_HOST } = process.env;
export const sendMail = async (to, subject, htmlContent) => {
  const transporter = nodeMailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: false,
    auth: {
      user: ADMIN_EMAIL,
      pass: ADMIN_PASSWORD,
    },
  });
  const options = {
    from: ADMIN_EMAIL,
    to: to,
    subject: subject,
    html: htmlContent,
  };
  return await transporter.sendMail(options);
};
