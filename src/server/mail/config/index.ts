import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { env } from "../../../env";

export const mailOptions: SMTPTransport.Options = {
  port: parseInt(env.SMTP_EMAIL_PORT),
  host: env.SMTP_EMAIL_HOST,
  auth: {
    user: env.SMTP_EMAIL_USER,
    pass: env.SMTP_EMAIL_PASS,
  },
};

export const mail = nodemailer.createTransport(mailOptions);
