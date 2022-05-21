const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const mailHelper = require("../utils/emailHelper");
const crypto = require("crypto");
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

exports.logout = BigPromise(async (req, res, next) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});
	res.status(200).json({
		success: true,
		message: "You have logged out successfully!!!",
	});
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (!user) {
		return next(new CustomError("e-mail not found as registered", 400));
	}

	const forgotToken = user.getForgotPasswordToken();

	await user.save({ validateBeforeSave: false });

	const myUrl = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/password/reset/${forgotToken}`;

	const message = `Copy paste this link in the URL and hit enter \n\n ${myUrl}`;

	try {
		await mailHelper({
			toEmail: user.email,
			subject: "E-commerce Store - Reset Password Email",
			message,
		});
		res.status(200).json({
			success: true,
			message: "Email sent successfully",
		});
	} catch (err) {
		user.forgotPasswordToken = undefined;
		user.forgotPasswordExpiry = undefined;
		await user.save({ validateBeforeSave: false });

		return next(new CustomError(err.message, 500));
	}
});

exports.passwordReset = BigPromise(async (req, res, next) => {
	const token = req.params.token;

	const encryptToken = crypto
		.createHash("sha256")
		.update(token)
		.digest("hex");

	const user = await User.findOne({
		encryptToken,
		forgotPasswordExpiry: { $gt: Date.now() },
	});

	if (!user) {
		return next(new CustomError("Token is invalid or expired", 400));
	}

	if (req.body.password != req.body.confirmPassword) {
		return next(
			new CustomError("Password and confirm password do not match", 400)
		);
	}

	user.password = req.body.password;
	user.forgotPasswordToken = undefined;
	user.forgotPasswordExpiry = undefined;

	await user.save();

	cookieToken(user, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		user,
	});
});

exports.changePassword = BigPromise(async (req, res, next) => {
	const userId = req.user.id;
	const { oldPassword, newPassword } = req.body;

	if (!oldPassword || !newPassword) {
		return next(
			new CustomError("Old password and confirm password is required"),
			400
		);
	}

	const user = await User.findById(userId).select("+password");
	const isCorrectOldPassword = await user.isValidatedPassword(oldPassword);

	if (!isCorrectOldPassword) {
		return next(new CustomError("Old password is invalid", 400));
	}

	user.password = newPassword;

	await user.save();

	cookieToken(user, res);
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {
	const userId = req.user.id;

	const { name, email } = req.body;

	if (!name || !email) {
		return next(new CustomError("Name and email is required!!!", 400));
	}

	const newData = {
		name: req.body.name,
		email: req.body.email,
	};

	if (req.files.photo !== "") {
		const user = await User.findById(userId);
		const imageId = user.photo.id;

		const resp = await cloudinary.uploader.destroy(imageId);

		const result = await cloudinary.uploader.upload(
			req.files.photo.tempFilePath,
			{
				folder: "users",
				width: 150,
				crop: "scale",
			}
		);

		newData.photo = {
			id: result.public_id,
			secure_url: result.secure_url,
		};
	}

	const user = await User.findByIdAndUpdate(userId, newData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({
		success: true,
		user,
	});
});
