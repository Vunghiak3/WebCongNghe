const express = require("express");
const router = express.Router();
const productController = require("./../app/controllers/productController");
// const authController = require("./../controllers/auth");
// const StaticData = require("./../utils/StaticData");

router.route("/:id").get(productController.show);

module.exports = router;
