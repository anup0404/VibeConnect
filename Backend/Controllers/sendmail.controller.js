const nodemailer = require("nodemailer");

const sendMail = async (user, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.ETHEREAL_HOST,
    port: process.env.ETHEREAL_PORT,
    secure: false, 
    auth: {
      user: process.env.ETHEREAL_EMAIL,
      pass: process.env.ETHEREAL_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Anup Kumar 👻" <${process.env.ETHEREAL_EMAIL}>`,
      to: user.email,
      subject: subject,
      text: text,
      html: `<b>${text}</b>`,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendMail };
