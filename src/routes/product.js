const express = require("express");
const router = express.Router();
const productController = require("./../app/controllers/productController");

router.param("id", productController.checkProductById);
router.route("/Phones").get(productController.showProductsForShop);
router.route("/Laptops").get(productController.showProductsForShop);
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
