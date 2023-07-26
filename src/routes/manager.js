const express = require("express");
const authController = require("../app/controllers/auth");
const productController = require("../app/controllers/productController");
const productCategoryController = require("../app/controllers/ProductCategoryController");
const userController = require("../app/controllers/user");
const StaticData = require("../utils/StaticData");
const router = express.Router();

router.route("/").get(
  authController.protect,
  authController.restricTo(
    StaticData.AUTH.Role.admin,
    StaticData.AUTH.Role.manager
  ),
  (req, res) => {
    res.render("manager", {
      title: "manager",
      linkcss: "/css/manager.css",
      linkjs: "/js/manager.js",
    });
  }
);

//PRODUCT
router.route("/Product").get(
  // authController.protect,
  // authController.restricTo(
  //   StaticData.AUTH.Role.admin,
  //   StaticData.AUTH.Role.manager
  // ),
  productController.showProductsForManager
);

router
  .route("/Product/create")
  .get(
    // authController.protect,
    // authController.restricTo(
    //   StaticData.AUTH.Role.admin,
    //   StaticData.AUTH.Role.manager
    // ),
    productController.showFormCreateProduct
  )
  .post(
    // authController.protect,
    // authController.restricTo(
    //   StaticData.AUTH.Role.admin,
    //   StaticData.AUTH.Role.manager
    // ),
    productController.createProductHandler
  );

router.route("/Product/:id/edit").get(
  // authController.protect,
  // authController.restricTo(
  //   StaticData.AUTH.Role.admin,
  //   StaticData.AUTH.Role.manager
  // ),
  productController.showFormUpdateProdct
);
router
  .route("/Product/:id")
  .patch(
    // authController.protect,
    // authController.restricTo(
    //   StaticData.AUTH.Role.admin,
    //   StaticData.AUTH.Role.manager
    // ),
    productController.updateProduct
  )
  .delete(
    // authController.protect,
    // authController.restricTo(
    //   StaticData.AUTH.Role.admin,
    //   StaticData.AUTH.Role.manager
    // ),
    productController.deleteProduct
  );

//CATEGORIES
router
  .route("/Category")
  .get(productCategoryController.showCategoryProductForManager);
router
  .route("/Category/create")
  .get(productCategoryController.showFormCreateProductCategory)
  .post(productCategoryController.createNewProductCategoryHandler);

router
  .route("/Category/:id/edit")
  .get(productCategoryController.showFormUpdateProductCategory);

router
  .route("/Category/:id")
  .patch(productCategoryController.updateProductCategoryHandler);

//USER
router.route("/User").get(userController.showUserForManager);

router
  .route("/User/create")
  .get(userController.showFormCreateUser)
  .post(userController.createUser);

router.route("/User/:id/edit").get(userController.showFormUpdateUser);

router.route("/User/:id").patch(userController.updateUser);

module.exports = router;
