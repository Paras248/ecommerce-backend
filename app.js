require("dotenv").config();
const express = require("express");
const app = express();

//import all routes here
const home = require("./routes/home");

//router middleware
app.use("/api/v1", home);

// exports app.js
module.exports = app;
