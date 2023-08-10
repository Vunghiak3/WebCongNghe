// paypalRouter.js
const express = require("express");
const PaypalDAO = require("../DAO/paypalDAO");

const router = express.Router();

router.post("/pay", async (req, res) => {
  // Pre-request Script
  console.log(req.body);
  const return_url = "http://localhost:8080/Home";
  const cancel_url = "http://localhost:8080";
  const item_name = "item1"; 
  const item_sku = "itemsku"; 
  const item_price = "10"; 
  const item_currency = "USD";

  // Set the JSON request body
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url,
      cancel_url,
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: item_name,
              sku: item_sku,
              price: item_price,
              currency: item_currency,
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: item_currency,
          total: item_price,
        },
        description: "Test Payment for Node.js",
      },
    ],
  };
  try {
    const approvalUrl = await PaypalDAO.createPayment(create_payment_json);
    res.redirect(approvalUrl);
  } catch (error) {
    throw error;
  }
});

router.get("/success", async (req, res) => {
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

  try {
    const payment = await PaypalDAO.executePayment(
      paymentId,
      execute_payment_json
    );
    res.render("success", {
      title: "Payment Successful",
      transactionId: payment.id,
    });
  } catch (error) {
    console.log(error.response);
    throw error;
  }
});

router.get("/cancel", (req, res) => {
  res.redirect("/cart")
});

module.exports = router;