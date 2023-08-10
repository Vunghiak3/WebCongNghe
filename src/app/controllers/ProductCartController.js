//Anh nam tạ works
const ProductCartDAO = require("./../../DAO/ProductCartDAO");
const UserDAO = require("../../DAO/UserDAO");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
//Unchecked
exports.deleteCartProductUser = async (req, res) => {
  try {
    if (req.session.token && req.session.token.startsWith("Bearer")) {
      token = req.session.token.split(" ")[1];
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const cartId = req.params.id * 1;
    await ProductCartDAO.deleteUserProductCart(cartId, userId);
    res.redirect("/Cart");
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

    const cart = await ProductCartDAO.getCartByUserId(userId);
    return res.status(200).json({
      code: 200,
      msg: `Get cart with user ${userId} successfully!`,
      data: { cart },
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

//check successfull
exports.addCart = async (req, res) => {
  const cart = req.body;
  try {
    cart.productId = req.params.id * 1;
    cart.quantity = parseFloat(cart.quantity);
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
    cart.userId = currentUser.userId;
    await ProductCartDAO.addCart(cart);
    return res.redirect(`/Cart`);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.showCart = async (req, res) => {
  let token;
  if (req.session.token && req.session.token.startsWith("Bearer")) {
    token = req.session.token.split(" ")[1];
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const id = decodedToken.id;
  try {
    let carts = await ProductCartDAO.getAllCartByUserId(id);
    await Promise.all(
      carts.map(async (cart) => {
        cart.price = cart.price.toLocaleString("vi-VN") + " VND";
      })
    );
    res.render("cart", {
      title: "Cart",
      linkcss: "/css/cart.css",
      linkjs: "/js/cart.js",
      carts,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.showCheckout = async (req, res) => {
  let token;
  if (req.session.token && req.session.token.startsWith("Bearer")) {
    token = req.session.token.split(" ")[1];
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const id = decodedToken.id;
  try {
    let carts = await ProductCartDAO.getAllCartByUserId(id);
    await Promise.all(
      carts.map(async (cart) => {
        cart.price = cart.price.toLocaleString("vi-VN") + " VND";
      })
    );
    res.render("checkout", {
      title: "Checkout",
      linkcss: "/css/checkout.css",
      linkjs: "/js/checkout.js",
      carts,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};
