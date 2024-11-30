import nodemailer from "nodemailer";
import env from "../config/env";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: env.smtp_host,
    port: 587,
    secure: env.node_env === "production",
    auth: {
      user: env.smtp_user,
      pass: env.smtp_pass,
    },
  });

  await transporter.sendMail({
    from: env.smtp_user,
    to,
    subject,
    text: "",
    html,
  });
};
