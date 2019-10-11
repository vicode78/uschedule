const nodemailer = require("nodemailer");
// const config = require("../config/mailer");
const mailGun = require("nodemailer-mailgun-transport");


const auth = {
    auth: {
        api_key: process.env.api_key,
        domain: process.env.domain
    }
}


const transporter = nodemailer.createTransport(mailGun(auth));


const sendMail = (email, subject, text, cb) => {
    const mailOptions = {
        from: email,
        to: process.env.Gmail,
        subject,
        text
    };

    transporter.sendMail(mailOptions, err => {
        if (err) {
            cb(err, null);
        } else {
            cb(null);
        }
    });
};

module.exports = sendMail;
