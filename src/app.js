const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const handlebars = require("express-handlebars");

app.use(express.json());
//HTTP logger
app.use(morgan("dev"));
//set path
app.use(express.static(path.join(__dirname, "public")));

// set handlebars
app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources\\views"));

app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
    linkcss: "/css/home.css",
  });
});

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
    linkcss: "/css/login.css",
    linkjs: "/js/login.js",
  });
});

app.get("/shop", (req, res) => {
  res.render("shop", {
    title: "Shop",
    linkcss: "/css/shop.css",
    // linkjs: "/js/shop.js"
  });
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    title: "Cart",
    linkcss: "/css/cart.css",
    linkjs: "/js/cart.js",
  });
});

app.get("/checkout", (req, res) => {
  res.render("checkout", {
    title: "Checkout",
    linkcss: "/css/checkout.css",
    linkjs: "/js/checkout.js",
  });
});

// app.get("/product", (req, res) => {
//   res.render("product", {
//     title: "Product",
//     linkcss: "/css/product.css",
//     linkjs: "/js/product.js",
//   });
// });

const productRouter = require("./routes/product");
app.use("/Phones", productRouter);

module.exports = app;
