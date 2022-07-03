const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProduct,
} = require("../controllers/productController");
const { isLoggedIn, customRole } = require("../middlewares/user");

// User routes
router.route("/products").get(getAllProduct);

// admin routes
router
  .route("/admin/product/add")
  .get(isLoggedIn, customRole("admin"), addProduct);

module.exports = router;
