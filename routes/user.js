const express = require("express");

const router = express.Router();

const {
	signup,
	login,
	logout,
	forgotPassword,
	passwordReset,
	getLoggedInUserDetails,
	changePassword,
	updateUserDetails,
	adminAllUsers,
} = require("../controllers/userController");

const { isLoggedIn, isAdmin } = require("../middlewares/user");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/password/update").post(isLoggedIn, changePassword);
router.route("/userdashboard/update").post(isLoggedIn, updateUserDetails);
router.route("/admin/users").get(isLoggedIn, isAdmin("admin"), adminAllUsers);

module.exports = router;
