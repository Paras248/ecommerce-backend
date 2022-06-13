const BigPromise = require("../middlewares/bigPromise");

exports.dummyProduct = BigPromise(async (req, res, next) => {
  res.status(200).json("Product page");
});
