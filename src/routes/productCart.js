//Anh nam tạ works
const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/auth");
const StaticData = require("../utils/StaticData");
const ProductCartController = require("./../app/controllers/ProductCartController");
const productController = require("./../app/controllers/productController");

router.param("id", productController.checkProductById);
// router.param("id", ProductCartController.checkCartById);
router
  .route("/")
  .get(authController.protect, ProductCartController.getCartByUserId);
router
  .route("/:id")
  .delete(authController.protect, ProductCartController.deleteCartProductUser)
  .patch(
    authController.protect,
    ProductCartController.updateProductQuantityUser
  );

router.route("/:id").post(ProductCartController.addCart);
module.exports = router;
