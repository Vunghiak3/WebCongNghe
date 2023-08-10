const paypal = require("paypal-rest-sdk");
require("dotenv").config({
  path: __dirname + "/./config/config.env",
});
paypal.configure({
  mode: "sandbox",
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
});

class PaypalDAO {
  static createPayment(paymentData) {
    return new Promise((resolve, reject) => {
      paypal.payment.create(paymentData, (error, payment) => {
        if (error) {
          reject(error);
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              resolve(payment.links[i].href);
              return;
            }
          }
        }
      });
    });
  }

  static executePayment(paymentId, executeData) {
    return new Promise((resolve, reject) => {
      paypal.payment.execute(paymentId, executeData, (error, payment) => {
        if (error) {
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });
  }
}

module.exports = PaypalDAO;
