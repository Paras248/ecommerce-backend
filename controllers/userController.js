const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const cookieToken = require("../utils/cookieToken");

exports.signup = BigPromise(async (req, res, next) => {
	if (!req.files) {
		return next(new CustomError("Photo is required for signup", 400));
	}

	const { name, email, password } = req.body;

	if (!email || !name || !password) {
		return next(
			new CustomError("Name, email and password are required", 400)
		);
	}

	let file = req.files.photo;
	const result = await cloudinary.uploader.upload(file.tempFilePath, {
		folder: "users",
		width: 150,
		crop: "scale",
	});

	const user = await User.create({
		name,
		email,
		password,
		photo: {
			id: result.public_id,
			secure_url: result.secure_url,
		},
	});

	cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		return next(new CustomError("Email and password are required!!!", 400));
	}

	const user = await User.findOne({ email }).select("+password");

	if (!user) {
		return next(
			new CustomError("Email or password does not match or exist", 400)
		);
	}

	const isPasswordCorrect = await user.isValidatedPassword(password);

	if (!isPasswordCorrect) {
		return next(
			new CustomError("Email or password does not match or exist", 400)
		);
	}

	cookieToken(user, res);
});
