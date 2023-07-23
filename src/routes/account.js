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

// router
//   .route("/Manager")
//   .get(
//     auth.protect,
//     auth.restricTo(StaticData.AUTH.Role.admin, StaticData.AUTH.Role.manager),
//     (req, res) => {
//       res.render("manager", {
//         title: "manager",
//         linkcss: "/css/manager.css",
//         linkjs: "/js/manager.js",
//       });
//     }
//   )
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

// router
//   .route("/Manager/:id")
//   .get(userController.getUser)
//   .delete(userController.deleteUser)
//   .patch(userController.updateUser);

module.exports = router;
