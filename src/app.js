const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const handlebars = require("express-handlebars");
const PORT = 8080;

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
    linkcss: "/css/app.css",
  });
});

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
    linkcss: "/css/login.css",
    linkjs: "/js/login.js"
  });
});

app.get("/product", (req, res) => {
  res.render("product", {
    title: "Product",
    linkcss: "/css/product.css",
    // linkjs: "/js/product.js"
  });
});

app.listen(PORT, () => {
  console.log(`Listening ${PORT}...`);
});
