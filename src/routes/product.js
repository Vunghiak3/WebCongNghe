const express = require("express");
const router = express.Router();
const productController = require("./../app/controllers/productController");

router.param("id", productController.checkProductById);
router.route("/Laptops").get(productController.showLaptopHandler);
router.route("/Phones").get(productController.showPhoneHandler);
router
  .route("/:category/:name/:id")
  .get(productController.showDetailProductHandler);

//Anh Nam ta works
router
  .route("/:id")
  .delete(productController.deleteProduct)
  .patch(productController.updateProduct);

router.route("/").post(productController.createProducts);
module.exports = router;
