import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ferrodriguezsegura@gmail.com",
    pass: "fhcm ydxb pber wibj",
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
