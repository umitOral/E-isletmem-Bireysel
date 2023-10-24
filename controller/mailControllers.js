

import { createTransport } from "nodemailer";
import dotenv from 'dotenv';
import {registerMail,resetPasswordMailHtml} from '../helpers/mails/registerMail.js';

dotenv.config({path:"../.env"});





const sendMail = async (req, res) => {
  try {
    
    const html = registerMail
    
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
      subject: "Başarıyla Kayıt oldunuz",
      html: html,
    });

    transporter.verify().then(console.log).catch(console.error);

    console.log("message sent:" + info.messageId);
    res.render("login",{
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



export { sendMail,passwordResetMail };
