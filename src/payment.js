const paypal = require("paypal-rest-sdk");
const express = require("express");
const router = express.Router();

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: "EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM",
  client_secret: "EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM",
});

var create_payment_json = {
  intent: "sale",
  payer: {
    payment_method: "paypal",
  },
  redirect_urls: {
    return_url: "http://localhost:8080/Home", // Update with your actual return URL
    cancel_url: "http://localhost:8080", // Update with your actual cancel URL
  },
  transactions: [
    {
      item_list: {
        items: [
          {
            name: "item",
            sku: "item",
            price: "1.00",
            currency: "USD",
            quantity: 1,
          },
        ],
      },
      amount: {
        currency: "USD",
        total: "1.00",
      },
    },
  ],
};

router.post("/pay", (req, res) => {
  paypal.payment.create(create_payment_json, function (error, payment) {
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

router.get("/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "VND",
          total: "16000000.00",
        },
      },
    ],
  };
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log(JSON.stringify(payment));
        res.send("Success");
      }
    }
  );
});

module.exports = router;
