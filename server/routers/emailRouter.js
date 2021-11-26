const { Router } = require("express");
const nodemailer = require("nodemailer");

const emailRouter = Router();

emailRouter
  .post("/", (req, res) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: req.body.email,
      subject: req.body.subject,
      html: req.body.mailBody,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) throw err;
    });
    res.status(200).send("Email send successfully");
  });

module.exports = emailRouter;