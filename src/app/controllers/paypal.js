// paypalRouter.js
const express = require("express");
const PaypalDAO = require("./paypalDAO");

const router = express.Router();

router.post("/pay", async (req, res) => {
  // Pre-request Script
  const return_url = "http://localhost:8080/Home";
  const cancel_url = "http://localhost:8080";
  const item_name = req.body.item_name;
  const item_sku = req.body.item_sku;
  const item_price = req.body.item_price;
  const item_currency = "VND";

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
    // ... (same as in the original code)
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
  res.render("cancel", { title: "Payment Cancelled" });
});

module.exports = router;
