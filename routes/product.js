const express = require("express");
const router = express.Router();
const { dummyProduct } = require("../controllers/productController");

router.route("/productdummy").get(dummyProduct);

module.exports = router;
