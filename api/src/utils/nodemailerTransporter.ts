import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error al conectar con SMTP:", error);
  } else {
    console.log("Conexión SMTP exitosa");
  }
});

const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await transporter.sendMail({
      from: `"SolidKey" ${process.env.SMTP_USER}`,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;
