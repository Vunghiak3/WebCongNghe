const jwt = require("jsonwebtoken");
const OrderDetailDAO = require("../../DAO/OrderDetailsDAO");
const OrderDAO = require("../../DAO/OrderDAO");

exports.getAllUserOrder = async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const order = await OrderDAO.getOrderByUserId(userId);
    return res.status(200).json({
      code: 200,
      msg: `Get user orders with ${userId} successfully!`,
      data: { order },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.getAllOrder = async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const order = await OrderDAO.getOrderByUserId(userId);
    return res.status(200).json({
      code: 200,
      msg: `Get user cart with ${userId} successfully!`,
      data: { order },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.updateOrderById = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const updateInfo = req.body;
    await OrderDAO.updateOrderById(id, updateInfo);
    const order = await OrderDAO.getOrderById(id);
    return res.status(200).json({
      code: 200,
      msg: `Update order with id: ${id} successfully!`,
      data: {
        order,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.deleteOrderById = async (req, res) => {
  try {
    const id = req.params.id * 1;
    await OrderDetailDAO.deleteDetailsByOrderId(id);
    await OrderDAO.deleteOrderById(id);
    return res.status(200).json({
      code: 200,
      msg: `Delete order with id: ${id} successfully!`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

//createOrder
