import { mail } from "~/server/mail/config";
import { render } from "jsx-email";
import { VerifyEmail } from "~/server/mail/emails/verification";
import { PassResetEmail } from "~/server/mail/emails/passwordReset";
import { TwoFactorEmail } from "~/server/mail/emails/twoFactorCode";
import { env } from "process";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendVerificationEmail = async ({
  email,
  validationCode,
}: {
  email: string;
  validationCode: string;
}) => {
  const baseURL = `${env.BASE_APP_URL}`;
  const validationLink = `${env.BASE_APP_URL}/verify-email?token=${validationCode}`;

  const html = await render(VerifyEmail({ validationLink, baseURL }));
  return new Promise<{
    err: Error | null;
    info: SMTPTransport.SentMessageInfo;
  }>((resolve) => {
    mail.sendMail(
      {
        from: "welcome@yourdigitaltoolbox.com",
        to: email,
        subject: "Email Validation Code",
        html: html,
      },
      (err, info) => {
        resolve({ err, info });
      },
    );
  });
};

export const sendPasswordResetEmail = async ({
  email,
  validationCode,
}: {
  email: string;
  validationCode: string;
}) => {
  const baseURL = `${env.BASE_APP_URL}`;
  const validationLink = `${env.BASE_APP_URL}/verify-reset?token=${validationCode}`;

  const html = await render(PassResetEmail({ validationLink, baseURL }));
  return new Promise<{
    err: Error | null;
    info: SMTPTransport.SentMessageInfo;
  }>((resolve) => {
    mail.sendMail(
      {
        from: "no-reply@yourdigitaltoolbox.com",
        to: email,
        subject: "Someone Requested to reset your password",
        html: html,
      },
      (err, info) => {
        resolve({ err, info });
      },
    );
  });
};

export const sendTwoFactorConfEmail = async ({
  email,
  validationCode,
}: {
  email: string;
  validationCode: string;
}) => {
  const baseURL = `${env.BASE_APP_URL}`;
  const html = await render(TwoFactorEmail({ validationCode, baseURL }));
  return new Promise<{
    err: Error | null;
    info: SMTPTransport.SentMessageInfo;
  }>((resolve) => {
    mail.sendMail(
      {
        from: "no-reply@yourdigitaltoolbox.com",
        to: email,
        subject: "Here's your 2FA code. ",
        html: html,
      },
      (err, info) => {
        resolve({ err, info });
      },
    );
  });
};
