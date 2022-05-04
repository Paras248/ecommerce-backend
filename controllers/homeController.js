const bigPromise = require("../middlewares/bigPromise");

exports.home = bigPromise(async (req, res) => {
	res.status(200).json({
		success: true,
		greeting: "hello from API",
	});
});

exports.homeDummy = async (req, res) => {
	try {
		res.status(200).json({
			success: true,
			greeting: "this is dummy of home",
		});
	} catch (err) {
		console.log(err);
	}
};
