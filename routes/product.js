const express = require("express");
const router = express.Router();
const { dummyProduct } = require("../controllers/productController");

router.route("/products/dummy").get(dummyProduct);

module.exports = router;
