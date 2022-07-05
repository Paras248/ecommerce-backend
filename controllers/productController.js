const Product = require("../models/product");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cloudinary = require("cloudinary").v2;
const WhereClause = require("../utils/WhereClause");

exports.addProduct = BigPromise(async (req, res, next) => {
  let imageArray = [];

  if (!req.files) {
    return next(new CustomError("Images are required!!!", 401));
  }

  if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );

      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }
  req.body.photos = imageArray;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

exports.getAllProduct = BigPromise(async (req, res, next) => {
  const resultPerPage = 6;
  const totalCountProduct = await Product.countDocuments();

  const productsObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();

  let products = await productsObj.base.clone();

  const filteredProductNumber = products.length;

  productsObj.pager(resultPerPage);

  products = await productsObj.base;

  res.status(200).json({
    success: true,
    products,
    filteredProductNumber,
    totalCountProduct,
  });
});
