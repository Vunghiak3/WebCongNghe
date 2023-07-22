const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const handlebars = require("express-handlebars");
const session = require("express-session");

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

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      //  secure: true
    },
  })
);

//get data by form
app.use(express.urlencoded({ extended: false }));
// app.get("/", (req, res) => {
//   res.render("home", {
//     title: "Home",
//     linkcss: "/css/home.css",
//   });
// });

app.use(async (req, res, next) => {
  if (req.session.isAuthenicated === null) {
    req.session.isAuthenicated = false;
  }

  res.locals.lcIsAuthenticated = req.session.isAuthenicated;
  res.locals.lcAuthUser = req.session.authUser;

  next();
});

app.get("/Account", (req, res) => {
  res.render("login", {
    title: "Login",
    linkcss: "/css/login.css",
    linkjs: "/js/login.js",
  });
});

// app.get("/shop", (req, res) => {
//   res.render("shop", {
//     title: "Shop",
//     linkcss: "/css/shop.css",
//     // linkjs: "/js/shop.js"
//   });
// });

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

const productRouter = require("./routes/product");
const hometRouter = require("./routes/home");
const userRouter = require("./routes/user");
app.use("/Home", hometRouter);
app.use("/Products", productRouter);
app.use("/Account", userRouter);

module.exports = app;
