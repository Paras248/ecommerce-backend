const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProduct,
  adminGetAllProducts,
} = require("../controllers/productController");
const { isLoggedIn, customRole } = require("../middlewares/user");

// User routes
router.route("/products").get(getAllProduct);

// admin routes
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);

router.route("/admin/products").get(adminGetAllProducts);

module.exports = router;
