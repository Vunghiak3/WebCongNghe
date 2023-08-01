//Anh nam tạ works
const ProductCartDAO = require("./../../DAO/ProductCartDAO");
const UserDAO = require("../../DAO/UserDAO");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
//Unchecked
exports.deleteCartProductUser = async (req, res) => {
  try {
    const productId = req.params.id * 1; //

    let token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    await ProductCartDAO.deleteUserProductCart(productId, userId);
    return res.status(200).json({
      code: 200,
      msg: `Delete product in cart with ${id} successfully!`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};
//Unchecked
exports.updateProductQuantityUser = async (req, res) => {
  try {
    const id = req.params.id * 1; //

    let token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    const updateInfo = req.body;
    await ProductCartDAO.updateQuantityByUser(id, userId, updateInfo);
    const product = await ProductDAO.getProductById(id);
    return res.status(200).json({
      code: 200,
      msg: `Update product id: ${id} successfully!`,
      data: {
        product,
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
//Unchecked
exports.getCartByUserId = async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    await ProductCartDAO.getCartByUserId(userId);
    return res.status(200).json({
      code: 200,
      msg: `Get cart with user ${id} successfully!`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};
//Unchecked
exports.checkCartById = async (req, res, next, val) => {
  try {
    const id = val;
    let cart = await ProductCartDAO.getCartById(id);
    if (!cart) {
      return res.status(404).json({
        code: 404,
        msg: `Not found cart with id ${id}`,
      });
    }
    req.cart = cart;
  } catch (e) {
    return res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
  next();
};

exports.addCart = async (req, res) => {
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
        msg: "Invalid authenication!",
      });
    }
    cart.userId = currentUser.userId
    console.log("🚀 ~ file: ProductCartController.js:116 ~ exports.addCart= ~ cart:", cart)
  try {
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};
