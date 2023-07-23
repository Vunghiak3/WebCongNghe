const express = require("express");
const router = express.Router();
const productController = require("./../app/controllers/productController");

router.param("id", productController.checkProductById);
<<<<<<< HEAD
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
=======

>>>>>>> a077fcf762e38f03a2694387b4cfe531881d3855
router.route("/Laptops").get(productController.showLaptopHandler);
router.route("/Phones").get(productController.showPhoneHandler);
router
  .route("/:category/:name/:id")
  .get(productController.showDetailProductHandler);

module.exports = router;
