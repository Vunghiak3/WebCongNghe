const jwt = require("jsonwebtoken");
const OrderDetailDAO = require("../../DAO/OrderDetailsDAO");
const OrderDAO = require("../../DAO/OrderDAO");
const UserDAO = require("../../DAO/UserDAO")
// exports.getAllUserOrder = async (req, res) => {
//   try {
//     let token = req.headers.authorization.split(" ")[1];
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decodedToken.id;
//     const order = await OrderDAO.getOrderByUserId(userId);
//     return res.status(200).json({
//       code: 200,
//       msg: `Get user orders with ${userId} successfully!`,
//       data: { order },
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({
//       code: 500,
//       msg: e.toString(),
//     });
//   }
// };

exports.getAllUserOrder = async (req, res) => {
  try {
    const cart = req.body;
    cart.productId = req.params.id * 1;
    
    let token;
    if (req.session.token && req.session.token.startsWith("Bearer")) {
      token = req.session.token.split(" ")[1];
    }
    
    if (!token) {
      return res.redirect("/Account");
    }
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await UserDAO.getUser(payload.id);
    
    if (!currentUser) {
      return res.status(401).json({
        code: 401,
        msg: "Invalid authentication!",
      });
    }
    const orders = await OrderDAO.getOrderByUserId(currentUser.userId);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        code: 404,
        msg: "No orders found for the user!",
      });
    }

    // Render the "orderList" template with the orders data
    res.render("orderList", {
      title: "Order List",
      linkcss: "/css/orderList.css",
      orders: orders, // Use "orders" instead of "order"
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
//CREATE
exports.createOrder = async (req, res) => {
  const order = req.body;
  try {
    order.totalPrice = req.body.totalPrice;
    req.body.shippingAddress = category.categoryId;
    req.body.orderStatus = "Pending";
    await OrderDAO.createNewOrder(order);

  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

//UPDATE
exports.updateOrder = async (req, res) => {
  try {
    const id = req.params.id * 1;
    req.body.price = parseFloat(req.body.price);
    req.body.quantity = parseFloat(req.body.quantity);
    const category = await ProductCategoriesDAO.getProductCategoryByName(
      req.body.categoryName
    );
    req.body.categoryId = category.categoryId;
    await OrderDAO.approvedOrder(id);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};