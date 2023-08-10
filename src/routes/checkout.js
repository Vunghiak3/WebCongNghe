const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/auth");
const StaticData = require("../utils/StaticData");
const ProductCartController = require("./../app/controllers/ProductCartController");
const productController = require("./../app/controllers/productController");

router.route("/").get(authController.protect, ProductCartController.showCheckout);

module.exports = router;