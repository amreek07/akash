const nodemailer = require('nodemailer');
const config = require('./config');

const transporter = nodemailer.createTransport(config.email.smtp);

const verifySmtpConnection = async () => {
    try {
        if (config.nodeEnv === 'test') return;

        await transporter.verify();
        console.log('Connected to email server');
    } catch (error) {
        console.error('Error connecting to email server:', error);

    }
}

module.exports = { transporter, verifySmtpConnection };