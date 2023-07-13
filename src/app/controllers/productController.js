const { query } = require("express");
const ProductDAO = require("./../../DAO/ProductDAO");

exports.getALLProductsHandler = async (req, res) => {
  try {
    const { page, pageSize, totalPage, totalItem, products } =
      await ProductDAO.getAllProducts(req.query);
    return res.status(200).json({
      code: 200,
      msg: "OK",
      page,
      pageSize,
      totalPage,
      totalItem,
      data: {
        products,
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

exports.show = async (req, res) => {
  const id = req.params.id * 1;
  const { page, pageSize, totalPage, totalItem, products } =
  await ProductDAO.getAllProducts(req.query);
  if (id > products.length - 1) {
    res.send("<h1>Can not find Product</h1>");
  } else {
    const pro = products[id];
    res.render("product", {
      title: "Product",
      linkcss: "/css/product.css",
      linkjs: "/js/product.js",
      products: {
        name: pro.productName,
        price: pro.price,
        description: pro.description,
      },
    });
  }
};
