const express = require('express');
const router = express.Router();
const orderController = require("../app/controllers/OrderController");
router.get('/', async (req, res) => {
    try {
      // Invoke the controller function and pass req and res
      await orderController.getAllUserOrder(req, res);
    } catch (e) {
      console.error(e);
      res.status(500).json({
        code: 500,
        msg: e.toString(),
      });
    }
  });
module.exports = router;
