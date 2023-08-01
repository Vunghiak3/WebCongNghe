const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const handlebars = require("express-handlebars");
const session = require("express-session");
const methodOverride = require("method-override");
// const authController = require("./app/controllers/auth");

//start of paypal test
const paypal = require("paypal-rest-sdk");

// Configure PayPal
paypal.configure({
  mode: "sandbox", // sandbox or live
  client_id:
    "AQbgZAurnwqO06DdEoSDbkD_f-YL1fX5NGxGL0eY3rmnhoiu-sipsjNsq4oivA0ezRdO7uBvKdVjcP1h",
  client_secret:
    "EN8z0dhpLkN_8eFRnWJY-6VmPqaCddxDGh6v0Vbc8a3_qxHjekjQyn91WEeEwmrHmtc6vKwyly4nTQ8R",
});

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// PayPal payment route
app.post("/pay", (req, res) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:8080/Home",
      cancel_url: "http://localhost:8080",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Test Item",
              sku: "ITEM001",
              price: "10.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "10.00",
        },
        description: "Test Payment for Node.js",
      },
    ],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
});

// Success route after payment completion
app.get("/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "10.00",
        },
      },
    ],
  };

  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      res.render("success", {
        title: "Payment Successful",
        transactionId: payment.id,
      });
    }
  });
});

// Cancel route if the user cancels the payment
app.get("/cancel", (req, res) => {
  res.render("cancel", { title: "Payment Cancelled" });
});

//end of paypal test
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
    helpers: {
      sum: (a, b) => a + b,
    },
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

app.use(methodOverride("_method"));

//get data by form
app.use(express.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  if (req.session.isAuthenicated === null) {
    req.session.isAuthenicated = false;
  }

  res.locals.errName = req.session.errName;
  res.locals.errEmail = req.session.errEmail;
  res.locals.errPassword = req.session.errPassword;
  res.locals.signUpSuccess = req.session.signUpSuccess;
  res.locals.lcIsAuthenticated = req.session.isAuthenicated;
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

module.exports = app;
