const express = require("express");
const router = express.Router();
const productController = require("./../app/controllers/productController");
const authController = require("../app/controllers/auth");
const StaticData = require("../utils/StaticData");

router.param("id", productController.checkProductById);
//Anh nam tạ works
router
  .route("/:id")
  .delete(productController.deleteProduct)
  .patch(productController.updateProduct);
// router
//   .route("/abc")
//   .post(
//     authController.protect,
//     authController.restricTo(
//       StaticData.AUTH.Role.admin,
//       StaticData.AUTH.Role.manager
//     ),
//     productController.createProductHandler
//   );
// router
//   .route("/:id")
//   .get(
//     authController.protect,
//     authController.restricTo(StaticData.AUTH.Role.admin),
//     productController.getProductHandler
//   );
router.route("/Laptops").get(productController.showLaptopHandler);
router.route("/Phones").get(productController.showPhoneHandler);
router
  .route("/:category/:name/:id")
  .get(productController.showDetailProductHandler);

module.exports = router;
