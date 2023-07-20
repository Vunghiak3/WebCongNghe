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
    console.log("🚀 ~ file: auth.js:20 ~ exports.login= ~ form:", form);
    if (!form.password_login || !form.username_login) {
      return res.status(403).json({
        code: 403,
        msg: "Invalid params",
      });
    }

    const user = await UserDAO.getUserByUserName(form.username_login);
    console.log("🚀 ~ file: auth.js:28 ~ exports.login= ~ user:", user);
    if (!user) {
      return res.status(401).json({
        code: 401,
        msg: `Invalid user - ${form.username_login}`,
      });
    }

    const isValidPassword = await bcrypt.compare(
      form.password_login,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({
        code: 401,

        msg: "Invalid authentication!",
      });
    }

    const token = signToken(user.userId, user.username);
    console.log("🚀 ~ file: auth.js:47 ~ exports.login= ~ token:", token);
    // res.status(200).json({
    //   code: 200,
    //   msg: "OK",
    //   data: {
    //     token,
    //   },
    // });
    res.render("home", {
      title: "home",
      linkcss: "/css/home.css",
      linkjs: "/js/home.js",
      islogin: true,
    });
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
    if (form.password !== form.repeatPassword) {
      return res.status(403).json({
        code: 403,
        msg: "Invalid password!",
      });
    }
    await UserDAO.addUser({
      username: form.username,
      password: form.password,
      email: form.email,
      name: form.name,
      address: form.address,
      phone: form.phone,
      roleId: StaticData.AUTH.Role.user,
    });
    const user = await UserDAO.getUserByUserName(form.username);
    delete user.password;
    delete user.passwordAt;
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
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
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        code: 401,
        msg: "Your are not logged in! Please log in to gert access.",
      });
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
      return res.status(403).json({
        code: 401,
        msg: "Your do not have permission to perform this action!",
      });
    }
    next();
  };
};

// exports.restric = (req, res, next) => {
//   if (!req.session.isAuthenticated) {
//     return res.redirect("/account");
//   }
//   next();
// };
