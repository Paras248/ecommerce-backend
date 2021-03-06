require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// for swagger documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

// import all routes here
const home = require("./routes/home");
const user = require("./routes/user");
const product = require("./routes/product");

// swagger middleware
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookies and fileUpload middleware
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// temp check - for image upload ejs view engine
app.set("view engine", "ejs");
app.get("/signuptest", (req, res) => {
  res.render("signupTest");
});

//morgan middleware
app.use(morgan("tiny"));

// router middleware
app.use("/api/v1", home);
app.use("/api/v1", user);
app.use("/api/v1", product);
// exports app.js
module.exports = app;
