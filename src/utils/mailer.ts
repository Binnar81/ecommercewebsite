process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import nodemailer from 'nodemailer';

const transporter=nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '25'),
  secure: process.env.SMTP_SECURE === 'false',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger:true,
  debug:true,
  ignoreTLS:true,
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2"
}
});


export const sendVerificationEmail = async (to: string, code: string) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: 'Verify your email',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  };

  await transporter.sendMail(mailOptions);
};