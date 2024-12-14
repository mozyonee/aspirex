const { users } = require('../models');
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async ({ to, name, subject, body }) => {
	const { SMTP_HOST, SMTP_EMAIL, SMTP_PASSWORD } = process.env;
	
	const transport = nodemailer.createTransport({
		host: SMTP_HOST,
		port: 587,
		auth: {
			user: SMTP_EMAIL,
			pass: SMTP_PASSWORD
		},
		debug: false,
		logger: false
	});
	
	try {
		await transport.verify();
	} catch (error) { console.log(error); }
	try {
		const userDB = await users.findOne({ where: { email: to } });
		if (userDB.banned != '1')  await transport.sendMail({ from: SMTP_EMAIL, to, subject, html: body });
		else console.log(`${to} is a banned user.`);
	} catch (error) { console.log(error); }
};

module.exports.sendMail = sendMail;