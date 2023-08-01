const express = require("express");
const userController = require("../app/controllers/user");
const authController = require("../app/controllers/auth");
const StaticData = require("../utils/StaticData");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

// router.param("id", userController.checkId);

router.route("/").get((req, res) => {
  res.render("login", {
    title: "Login",
    linkcss: "/css/login.css",
    linkjs: "/js/login.js",
  });
});

router
  .route("/forgot-password")
  .get((req, res) => {
    res.render("forgotPassword", {
      linkcss: "/css/forgotPassword.css",
    });
  })
  .patch(userController.changePassword);

module.exports = router;
