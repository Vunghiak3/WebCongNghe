const UserDAO = require("../../DAO/UserDAO");
const RoleDAO = require("../../DAO/RoleDAO");
const querystring = require("querystring");

exports.showUserForManager = async (req, res) => {
  try {
    const { page, pageSize, totalPage, totalItem, users } =
      await UserDAO.getAllUsers(req.query);

    await Promise.all(
      users.map(async (user) => {
        const roles = await RoleDAO.getRoleById(user.roleId);
        user.roleName = roles.roleName;
      })
    );

    const pages = [];
    for (let i = 1; i <= totalPage; i++) {
      pages.push({
        page: i,
        queryPage: querystring.stringify({ ...req.query, page: i }),
        active: i === page,
      });
    }
    const isFirstPage = page !== 1 && totalPage > 1;
    const isLastPage = page !== totalPage && totalPage > 1;

    const productPartialData = {
      totalPage: totalPage,
      pages: pages,
      isFirstPage: isFirstPage,
      isLastPage: isLastPage,
    };

    return res.render("manager", {
      title: "Manager",
      linkjs: "/js/manager.js",
      linkcss: "/css/manager.css",
      users,
      productPartialData,
      isUser: true,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};

exports.showFormCreateUser = async (req, res) => {
  try {
    const roles = await RoleDAO.getAllRole();
    return res.render("createNew/newUser", {
      title: "Create new User",
      linkcss: "/css/newProduct.css",
      roles,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};

exports.showFormUpdateUser = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const user = await UserDAO.getUser(id);
    const roles = await RoleDAO.getAllRole();
    const index = roles.findIndex((role) => role.roleId === user.roleId);

    if (index !== -1) {
      const role = roles[index];
      roles.splice(index, 1);
      roles.unshift(role);
    }

    return res.render("update/updateUser", {
      title: "Update new User",
      linkcss: "/css/newProduct.css",
      user,
      roles,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};

exports.checkId = async (req, res, next, val) => {
  try {
    const id = val;
    let user = await UserDAO.getUser(id);
    if (!user) {
      return res.status(404).json({
        code: 404,
        msg: `Not found user with id: ${id}`,
      });
    }
    req.user = user;
  } catch (e) {
    console.error(e);
    return res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
  next();
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page, pageSize, totalPage, totalItem, users } =
      await UserDAO.getAllUsers(req.query);
    res.status(200).json({
      code: 200,
      msg: "OK",
      page,
      pageSize,
      totalPage,
      totalItem,
      data: {
        users,
      },
    });
  } catch (e) {
    console.error(e);
    res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      code: 200,
      msg: "OK",
      data: { user },
    });
  } catch (e) {
    console.error(e);
    res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};

exports.createUser = async (req, res) => {
  const newUser = req.body;
  try {
    const role = await RoleDAO.getRoleByName(newUser.roleName);
    newUser.roleId = role.roleId;
    await UserDAO.addUser(newUser);
    res.redirect("/Manager/User");
  } catch (e) {
    console.error(e);
    res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id * 1;
    await UserDAO.deleteUser(id);

    res.status(200).json({
      code: 200,
      msg: `Delete user with ${id} successfully!`,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const updateUser = req.body;
    await UserDAO.updateUser(id, updateUser);
    const user = await UserDAO.getUser(id);
    res.redirect("/Manager/User");
  } catch (e) {
    console.error(e);
    res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const updateUser = req.body;
    if(updateUser.password !== updateUser.confirmPassword){
      return res.redirect("/Account/forgot-password")
    }
    const user = await UserDAO.getUserByUserName(updateUser.username);
    if(!user){
      return res.redirect("/Account/forgot-password")
    }
    await UserDAO.updateUser(user.userId, updateUser);
    res.redirect("/Account");
  } catch (e) {
    console.error(e);
    res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};
