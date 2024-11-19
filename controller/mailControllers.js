import { createTransport } from "nodemailer";



import dotenv from "dotenv";
import {
  contactEmailHTML,
  paymentSuccessMailHTML,
  registerMailHTML,
  resetPasswordMailHtml,
  
} from "../helpers/mails/mails.js";
import { Ticket, ticketStatus } from "../models/ticketModel.js";

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
const sendRegisterMail = async () => {
  try {
    const html = registerMailHTML;
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
      
    });

    transporter.verify().then(console.log).catch(console.error);
    console.log("message sent:" + info.messageId);
  } catch (error) {
    console.log(error);
  }
};

const sendPasswordResetMail = async (email, url) => {
  try {
    let html = resetPasswordMailHtml(url);

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

      
    let html = paymentSuccessMailHTML(data)
      
    const info = await transporter.sendMail({
      from: `E-işletmem <${process.env.EMAIL_ADRESS}>`,
      to: "umit.oralmat10@gmail.com",
      subject: "Ödeme alındı",
      html:html
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
    const html = contactEmailHTML(req.body.message);
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
  sendRegisterMail,
  sendPasswordResetMail,
  contactEmail,
  orderSuccesEmail,
  sendErrorEmail,
  sendCustomMail,
  sendMailWithData,
};
