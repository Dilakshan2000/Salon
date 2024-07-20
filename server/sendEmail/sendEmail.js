
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, content) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: 'amith457n@gmail.com', 
        pass: 'whcx fhev ecyo fbwk', 
      },
    });

   
    const mailOptions = {
      from: 'amith457n@gmail.com',
      to,
      subject,
      html: content,
    };

   
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;

