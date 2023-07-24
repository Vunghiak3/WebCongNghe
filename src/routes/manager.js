const express = require("express");
const authController = require("../app/controllers/auth");
const productController = require("../app/controllers/productController");
const StaticData = require("../utils/StaticData");
const router = express.Router();

router
  .route("/")
  .get(
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

router
  .route("/Product")
  .get(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.manager
    ),
    productController.getALLProductsHandler
  );

module.exports = router;
