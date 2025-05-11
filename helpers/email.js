const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const sendEmailWithNodemailer = async(emailData) => {
        const mailOptions = {
            from: 'FastCart <process.env.SMTP_USERNAME>', // sender address
            to: emailData.email, // list of receivers
            subject: emailData.subject, // Subject line
            html: emailData.html, // html body
        };

        try {
            
            const info = await transporter.sendMail(mailOptions);
            console.log("Message sent", info.response)
        } catch (error) {
            console.error("Message sending failed", error.message);
            throw error;
        }

  };

  module.exports = sendEmailWithNodemailer;