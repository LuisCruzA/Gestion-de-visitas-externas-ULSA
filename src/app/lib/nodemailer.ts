// lib/nodemailer.js
import nodemailer from 'nodemailer';



const transporter = nodemailer.createTransport({
  service: 'gmail', // Cambia esto según el servicio de correo que utilices
  auth: {
    user: process.env.EMAIL_USER,  // Tu correo de Gmail o cualquier correo configurado
    pass: process.env.EMAIL_PASS,  // La contraseña de tu correo o aplicación de contraseñas
  },
});

const sendEmail = (to:string , subject:string , text:string ) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // El correo que enviará el mensaje
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

export { sendEmail };
