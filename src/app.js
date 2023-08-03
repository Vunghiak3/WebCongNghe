const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const handlebars = require("express-handlebars");
const session = require("express-session");
const methodOverride = require("method-override");

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

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

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  if (req.session.isAuthenticated === null) {
    // Fix the variable name
    req.session.isAuthenticated = false; // Fix the variable name
  }

  res.locals.errName = req.session.errName;
  res.locals.errEmail = req.session.errEmail;
  res.locals.errPassword = req.session.errPassword;
  res.locals.signUpSuccess = req.session.signUpSuccess;
  res.locals.lcIsAuthenticated = req.session.isAuthenticated; // Fix the variable name
  res.locals.lcAuthUser = req.session.authUser;

  next();
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

const paypalRouter = require("./routes/paypalRouter");
const productRouter = require("./routes/product");
const hometRouter = require("./routes/home");
const accountRouter = require("./routes/account");
const managerRouter = require("./routes/manager");
const cartRouter = require("./routes/productCart");

app.use("/Home", hometRouter);
app.use("/Products", productRouter);
app.use("/Account", accountRouter);
app.use("/Manager", managerRouter);
app.use("/Cart", cartRouter);
app.use("/paypal", paypalRouter);

module.exports = app;
