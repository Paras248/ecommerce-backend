const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide a name!!!"],
		maxlength: [40, "Name should be under 40 characters!!!"],
	},
	email: {
		type: String,
		required: [true, "Please provide an email!!!"],
		validate: [
			validator.isEmail,
			"Please enter the email in correct format",
		],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Please Provide the password!!!"],
		minlength: [6, 'password should be atleast 6 character!!!'],
		select: false
	},
	photo: {
		id: {
			type: String,
			required: true
		},
		secure_url: {
			type: String,
			required: true
		}
	},
	role: {
		type: String
		default: 'user',
	},
	forgotPasswordToken: String,
	forgotPasswordExpiry: Date,
	createdAt: {
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model("User", userSchema);
