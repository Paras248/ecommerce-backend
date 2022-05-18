const nodemailer = require("nodemailer");

const mailHelper = async (option) => {
	let transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		auth: {
			user: process.env.SMTP_USER, // generated ethereal user
			pass: process.env.SMTP_PASS, // generated ethereal password
		},
	});

	const message = {
		from: "paraspatil248@gmail.com", // sender address
		to: option.toEmail,
		subject: option.subject, // Subject line
		text: option.message, // plain text body
		//	    html: "<a><but></a>", // html body
	};

	await transporter.sendMail(message);
};

module.exports = mailHelper;
