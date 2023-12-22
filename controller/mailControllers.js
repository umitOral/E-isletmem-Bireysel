

import { createTransport } from "nodemailer";
import dotenv from 'dotenv';
import {contactEmailHTML,registerMail,resetPasswordMailHtml} from '../helpers/mails/mails.js';
import {Ticket,ticketStatus} from '../models/ticketModel.js'

dotenv.config({path:"../.env"});





const sendMail = async (req, res) => {
  try {
    
    const html = registerMail
    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.MAIL_ADRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `E-işletmem <${process.env.MAIL_ADRESS}>`,
      to: req.body.email,
      subject: "Başarıyla Kayıt oldunuz",
      html: html,
    });

    transporter.verify().then(console.log).catch(console.error);

    console.log("message sent:" + info.messageId);
    res.json({
        message:"kaydınız başarıyla oluşturuldu"
    })

  } catch (error) {
    console.log(error);
  }
};
const passwordResetMail = async (email,url) => {
  try {
    
    const html = resetPasswordMailHtml(url)
    

    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.MAIL_ADRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `E-işletmem <${process.env.MAIL_ADRESS}>`,
      to: email,
      subject: "Parola Sıfırlama",
      html: html,
    });

    transporter.verify().then(console.log).catch(console.error);

    console.log("mail başarılı")
    

  } catch (error) {
    console.log(error);
  }
};
const orderSuccesEmail=async(request)=>{
  try {


    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.MAIL_ADRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `E-işletmem <${process.env.MAIL_ADRESS}>`,
      to: "umit.oralmat10@gmail.com",
      subject: "Ödemeniz alındı",
      html: request.price+"'lik ödemeniz başarıyla gerçekleşti",
    });

    transporter.verify().then(console.log).catch(console.error);

    
   console.log("ödeme mail atıldı")
    
  } catch (error) {
   console.log(error)
  }
}
const contactEmail=async(req,res)=>{
  try {

    const data={
      name:req.body.name,
      messages:req.body.message,
      phone:req.body.phone,
      email:req.body.email,
      ticketStatus:ticketStatus.OPEN
    }
    const html = contactEmailHTML
    console.log(data)
    await Ticket.create(data)
    console.log("mail başarılı")

    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.MAIL_ADRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `E-işletmem <${process.env.MAIL_ADRESS}>`,
      to: req.body.email,
      subject: "Mesajınızı Aldık",
      html: html,
    });

    transporter.verify().then(console.log).catch(console.error);

    
    res.render("front/contact-us",{
        message:"kaydınız başarıyla oluşturuldu"
    })
    
  } catch (error) {
    res.status(400).json({
      succes:false,
      message:error
    })
  }
}



export { sendMail,passwordResetMail,contactEmail,orderSuccesEmail};
