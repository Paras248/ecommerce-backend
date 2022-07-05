const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProduct,
  adminGetAllProducts,
  getSingleProduct,
  adminUpdateSingleProduct,
} = require("../controllers/productController");
const { isLoggedIn, customRole } = require("../middlewares/user");

// User routes
router.route("/products").get(getAllProduct);
router.route("/product/:id").get(getSingleProduct);

// admin routes
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);

router
  .route("/admin/products")
  .get(isLoggedIn, customRole("admin"), adminGetAllProducts);
router
  .route("/admin/product/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateSingleProduct);

module.exports = router;
