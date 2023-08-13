const express = require("express");
const jwt = require("jsonwebtoken");
const PaypalDAO = require("../DAO/paypalDAO");
const OrderDAO = require("../DAO/OrderDAO")
const UserDAO = require("../DAO/UserDAO")

const router = express.Router();

router.post("/pay", async (req, res) => {
  try {
    let token;
    if (req.session.token && req.session.token.startsWith("Bearer")) {
      token = req.session.token.split(" ")[1];
    }
    
    if (!token) {
      return res.redirect("/Account");
    }
    //create order
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await UserDAO.getUser(payload.id);
    const { shippingAddress, totalAmount } = req.body;
    
    const order = {
      userId: currentUser.userId,
      shippingAddress,
      orderStatus: "Pending",
      totalAmount: parseFloat(totalAmount),
    };
    
    await OrderDAO.createNewOrder(order);
    
    // PayPal payment
    const return_url = "http://localhost:8080/paypal/success";
    const cancel_url = "http://localhost:8080/paypal/cancel";
    const item_name = "item1";
    const item_sku = "itemsku";
    const item_price = parseFloat(totalAmount); // Use the total amount from the form
    const item_currency = "USD";

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
    req.session.totalAmount = totalAmount; //totalAmount
    // Redirect to PayPal for payment
    const approvalUrl = await PaypalDAO.createPayment(create_payment_json);
    res.redirect(approvalUrl);
  } catch (error) {
    console.error(error);
  }
});

router.get("/success", async (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const totalAmount = req.session.totalAmount; //totalAmount
  let token;
  if (req.session.token && req.session.token.startsWith("Bearer")) {
    token = req.session.token.split(" ")[1];
  }
  
  if (!token) {
    return res.redirect("/Account");
  }
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const currentUser = await UserDAO.getUser(payload.id);
  const orderId = await OrderDAO.getnewestOrderByUser(currentUser.userId);
  
  await OrderDAO.approvedOrder(orderId.orderId)

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: totalAmount,
        },
      },
    ],
  };

  try {
    const payment = await PaypalDAO.executePayment(
      paymentId,
      execute_payment_json
    );
      res.render("orderSuccess", {
        title: "Order Success",
        linkcss: "/css/orderSuccess.css"
    });
  } catch (error) {
    console.log(error.response);
    throw error;
  }
});

router.get("/cancel", (req, res) => {
    res.render("orderCancel", {
      title: "Order Cancel",
      linkcss: "/css/cancelOrder.css"
    });
});

module.exports = router;
