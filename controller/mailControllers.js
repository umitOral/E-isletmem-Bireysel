import { createTransport } from "nodemailer";



import dotenv from "dotenv";
import {
  contactEmailHTML,
  registerMail,
  resetPasswordMailHtml,
  welcomeMail,
} from "../helpers/mails/mails.js";
import { Ticket, ticketStatus } from "../models/ticketModel.js";
import path from "path";


dotenv.config({ path: "../.env" });

const sendMailWithData = async (receiver, subject, data) => {
  try {
    const transporter = createTransport({
      host: process.env.EMAIL_SMTP,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `E-işletmem <${process.env.EMAIL_ADRESS}>`,
      to: receiver,
      subject: subject,
      html: data,
    });

    transporter.verify().then(console.log).catch(console.error);
  } catch (error) {
    console.log(error);
  }
};
const sendCustomMail = async (data) => {
  try {
    const transporter = createTransport({
      host: process.env.EMAIL_SMTP,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `E-işletmem <${process.env.EMAIL_ADRESS}>`,
      to: "umit.oralmat10@gmail.com",
      subject: "smsSTATUS DATA EMAİL",
      html: `${JSON.stringify(data)}`,
    });

    transporter.verify().then(console.log).catch(console.error);
  } catch (error) {
    console.log(error);
  }
};
const sendTestMail = async () => {
  try {
    const html = welcomeMail;
    const transporter = createTransport({
      host: process.env.EMAIL_SMTP,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    const info = await transporter.sendMail({
      from: `E-işletmem <${process.env.EMAIL_ADRESS}>`,
      to: "umit.oralmat10@gmail.com",
      subject: "Başarıyla Kayıt oldunuz",
      html: html,
      attachments: [
        {
          filename: "image-1.png", // E-posta içine gömülecek resim dosyası
          path:"https://www.e-isletmem.com/mail-photos/registerMail/image-1.png", // Resmin dosya yolu
          cid: "image-1", // Resmi HTML ile ilişkilendiren Content-ID
        },
       
        {
          filename: "image-2.png", // E-posta içine gömülecek resim dosyası
          path:"https://www.e-isletmem.com/mail-photos/registerMail/image-2.png", // Resmin dosya yolu 
          cid: "image-2", // Resmi HTML ile ilişkilendiren Content-ID
        },
        {
          filename: "image-3.png", // E-posta içine gömülecek resim dosyası
          path:"https://www.e-isletmem.com/mail-photos/registerMail/image-3.png", // Resmin dosya yolu 
          cid: "image-3", // Resmi HTML ile ilişkilendiren Content-ID
        },
        {
          filename: "image-4.png", // E-posta içine gömülecek resim dosyası
          path:"https://www.e-isletmem.com/mail-photos/registerMail/image-4.png", // Resmin dosya yolu
          cid: "image-4", // Resmi HTML ile ilişkilendiren Content-ID
        },
        {
          filename: "image-5.png", // E-posta içine gömülecek resim dosyası
          path:"https://www.e-isletmem.com/mail-photos/registerMail/image-5.png", // Resmin dosya yolu 
          cid: "image-5", // Resmi HTML ile ilişkilendiren Content-ID
        },
        {
          filename: "image-6.png", // E-posta içine gömülecek resim dosyası
          path:"https://www.e-isletmem.com/mail-photos/registerMail/image-6.png", // Resmin dosya yolu 
          cid: "image-6", // Resmi HTML ile ilişkilendiren Content-ID
        },
        {
          filename: "image-7.png", // E-posta içine gömülecek resim dosyası
          path:"https://www.e-isletmem.com/mail-photos/registerMail/image-7.png", // Resmin dosya yolu 
          cid: "image-7", // Resmi HTML ile ilişkilendiren Content-ID
        },
        {
          filename: "image-8.jpeg", // E-posta içine gömülecek resim dosyası
          path:"https://www.e-isletmem.com/mail-photos/registerMail/image-8.jpeg", // Resmin dosya yolu 
          cid: "image-8", // Resmi HTML ile ilişkilendiren Content-ID
        },
        
      ],
    });

    transporter.verify().then(console.log).catch(console.error);

    console.log("message sent:" + info.messageId);
  } catch (error) {
    console.log(error);
  }
};
const sendMail = async (req, res) => {
  try {
    const html = registerMail;
    const transporter = createTransport({
      host: process.env.EMAIL_SMTP,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `E-işletmem <${process.env.EMAIL_ADRESS}>`,
      to: req.body.email,
      subject: "Başarıyla Kayıt oldunuz",
      html: html,
    });

    transporter.verify().then(console.log).catch(console.error);

    console.log("message sent:" + info.messageId);
    res.json({
      message: "kaydınız başarıyla oluşturuldu",
    });
  } catch (error) {
    console.log(error);
  }
};
const passwordResetMail = async (email, url) => {
  try {
    const html = resetPasswordMailHtml(url);

    const transporter = createTransport({
      host: process.env.EMAIL_SMTP,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `E-işletmem <${process.env.EMAIL_ADRESS}>`,
      to: email,
      subject: "Parola Sıfırlama",
      html: html,
    });

    transporter
      .verify()
      .then((response) => console.log("mail başarılı"))
      .catch((err) => console.log("mail başarısız"));
  } catch (error) {
    console.log(error);
  }
};

const sendErrorEmail = async (err) => {
  try {
    const transporter = createTransport({
      host: process.env.EMAIL_SMTP,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `E-işletmem <${process.env.EMAIL_ADRESS}>`,
      to: "umit.oralmat10@gmail.com",
      subject: "hata alındı",
      html: err.stack,
    });

    transporter.verify().then(console.log).catch(console.error);
  } catch (error) {
    console.log(error);
  }
};
const orderSuccesEmail = async (request) => {
  try {
    const transporter = createTransport({
      host: process.env.EMAIL_SMTP,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `E-işletmem <${process.env.EMAIL_ADRESS}>`,
      to: "umit.oralmat10@gmail.com",
      subject: "Ödemeniz alındı",
      html: request.price + "'lik ödemeniz başarıyla gerçekleşti",
    });

    transporter.verify().then(console.log).catch(console.error);

    console.log("ödeme mail atıldı");
  } catch (error) {
    console.log(error);
  }
};
const contactEmail = async (req, res) => {
  try {
    // console.log(req.body)
    const params = new URLSearchParams(req.body);
    console.log(req.body);
    const data = {
      name: req.body.name,
      messages: req.body.message,
      phone: req.body.phone,
      email: req.body.email,
      ticketStatus: ticketStatus.OPEN,
    };
    const html = contactEmailHTML;
    await Ticket.create(data);

    const transporter = createTransport({
      host: process.env.EMAIL_SMTP,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `E-işletmem <${process.env.EMAIL_ADRESS}>`,
      to: req.body.email,
      subject: "Mesajınızı Aldık",
      html: html,
    });

    transporter.verify().then(console.log).catch(console.error);

    res.json({
      success: true,
      message: "mesajınızı aldık",
    });
  } catch (error) {
    res.status(400).json({
      succes: false,
      message: error,
    });
  }
};

export {
  sendMail,
  sendTestMail,
  passwordResetMail,
  contactEmail,
  orderSuccesEmail,
  sendErrorEmail,
  sendCustomMail,
  sendMailWithData,
};
