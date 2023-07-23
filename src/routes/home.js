const express = require("express");
const router = express.Router();
const productController = require("./../app/controllers/productController");

router
  .route("/")
  .get((req, res) => {
    res.render(
      res.render("home", {
        title: "Home",
        linkcss: "/css/home.css",
      })
    );
  })
  .get(productController.showTopProductHandler);

module.exports = router;
