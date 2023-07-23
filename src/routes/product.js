const express = require("express");
const router = express.Router();
const productController = require("./../app/controllers/productController");

router.param("id", productController.checkProductById);

router.route("/Laptops").get(productController.showLaptopHandler);
router.route("/Phones").get(productController.showPhoneHandler);
router
  .route("/:category/:name/:id")
  .get(productController.showDetailProductHandler);

module.exports = router;
