const UserDAO = require("../../DAO/UserDAO");
const StaticData = require("../../utils/StaticData");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signToken = (id, username) => {
  return jwt.sign(
    {
      id: id,
      username: username,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRED_IN }
  );
};

exports.login = async (req, res) => {
  try {
    const form = req.body;
    if (!form.password_login || !form.username_login) {
      // return res.status(403).json({
      //   code: 403,
      //   msg: "Invalid params",
      // });
      return res.redirect("/Account");
    }

    const user = await UserDAO.getUserByUserName(form.username_login);
    if (!user) {
      // return res.status(401).json({
      //   code: 401,
      //   msg: `Invalid user - ${form.username_login}`,
      // });
      return res.redirect("/Account");
    }

    const isValidPassword = await bcrypt.compare(
      form.password_login,
      user.password
    );
    // if (!isValidPassword) {
    //   return res.status(401).json({
    //     code: 401,

    //     msg: "Invalid authentication!",
    //   });
    // }
    console.log(
      "🚀 ~ file: auth.js:49 ~ exports.login= ~ !isValidPassword:",
      !isValidPassword
    );
    if (!isValidPassword) {
      // return res.render("login", {
      //   linkcss: "/css/login.css",
      // });
      return res.redirect("/Account");
    }
    const token = signToken(user.userId, user.username);
    req.session.isAuthenicated = true;
    req.session.token = `Bearer ${token}`;
    delete user.password;
    req.session.authUser = user;

    if (user.roleId === StaticData.AUTH.Role.admin) {
      return res.redirect("/Manager");
    } else if (user.roleId === StaticData.AUTH.Role.user) {
      return res.redirect("/Profile");
    }
  } catch (e) {
    console.error(e);
    res
      .status(500) // 401 - Unauthorized
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};

exports.signup = async (req, res) => {
  try {
    const form = req.body;
    if (form.password_register !== form.again_pass) {
      // return res.status(403).json({
      //   code: 403,
      //   msg: "Invalid password!",
      // });
      // req.session.errEmail = false;
      req.session.errName = false;
      req.session.errPassword = true;
      return res.redirect("/Account");
    }

    const user1 = await UserDAO.getUserByUserName(form.username_register);
    if (user1 && user1.username) {
      // req.session.errEmail = false;
      req.session.errPassword = false;
      req.session.errName = true;
      return res.redirect("/Account");
    }

    await UserDAO.addUser({
      username: form.username_register,
      password: form.password_register,
      email: form.email,
      name: form.fullname,
      address: form.address,
      phone: form.phonenumber,
      roleId: StaticData.AUTH.Role.user,
    });
    const user = await UserDAO.getUserByUserName(form.username_register);
    delete user.password_register;
    // res.status(201).json({
    //   status: "success",
    //   data: {
    //     user,
    //   },
    // });
    if (user) {
      req.session.signUpSuccess = true;
      req.session.errPassword = false;
      res.redirect("/Account");
    }
  } catch (e) {
    console.error(e);
    res
      .status(500) // 401 - Unauthorized
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};

exports.protect = async (req, res, next) => {
  try {
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
    req.user = currentUser;
  } catch (e) {
    console.error(e);
    res
      .status(500) // 401 - Unauthorized
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
  next();
};

exports.restricTo = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.roleId)) {
      // return res.status(403).json({
      //   code: 401,
      //   msg: "Your do not have permission to perform this action!",
      // });
      return res.send(
        "<h1>Your do not have permission to perform this action!</h1>"
      );
    }
    next();
  };
};
