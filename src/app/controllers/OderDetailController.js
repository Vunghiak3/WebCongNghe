const jwt = require("jsonwebtoken");
const OrderDetailDAO = require("../../DAO/OrderDetailsDAO");

exports.getallOrderDetails = async (req, res) => {
  try {
    const details = await OrderDetailDAO.getallOrderDetails();
    return res.status(200).json({
      code: 200,
      msg: `Get all order details successfully!`,
      data: { details },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.getDetailByOrderId = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const details = await OrderDetailDAO.getDetailByOrderId(id);
    return res.status(200).json({
      code: 200,
      msg: `Get details with ${id} successfully!`,
      data: { details },
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
    await OrderDetailDAO.updateOrderDetails(id, updateInfo);
    const order = await OrderDetailDAO.getDetailByOrderId(id);
    return res.status(200).json({
      code: 200,
      msg: `Update details with id: ${id} successfully!`,
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

exports.deleteDetailById = async (req, res) => {
  try {
    const id = req.params.id * 1;
    await OrderDetailDAO.deleteOrderDetailsById(id);
    return res.status(200).json({
      code: 200,
      msg: `Delete details with id: ${id} successfully!`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

//create
