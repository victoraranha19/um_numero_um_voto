import { EMAIL_SITE } from '@lib/constants';
import nodemailer from 'nodemailer';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

async function enviarEmail({
  from = EMAIL_SITE,
  to,
  subject,
  text,
  html,
}: EmailOptions): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: from,
        pass: process.env.GOOGLE_APP_PASSWORD, // The 16-character App Password
      },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email enviado com sucesso! Message ID: ${info.messageId}`);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
}

export default enviarEmail;
