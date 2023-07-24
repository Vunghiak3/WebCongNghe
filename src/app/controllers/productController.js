const ProductDAO = require("./../../DAO/ProductDAO");
const ProductCartDAO = require("./../../DAO/ProductCartDAO");
const jwt = require("jsonwebtoken");

exports.getALLProductsHandler = async (req, res) => {
  try {
    const { page, pageSize, totalPage, totalItem, products } =
      await ProductDAO.getAllProducts(req.query);
    console.log(
      "🚀 ~ file: productController.js:17 ~ returnres.status ~ products:",
      products
    );
    return res.render("manager", {
      title: "Manager",
      linkcss: "/css/manager.css",
      linkjs: "/js/manager.js",
      product: true,
    });
    // return res.status(200).json({
    //   code: 200,
    //   msg: "OK",
    //   page,
    //   pageSize,
    //   totalPage,
    //   totalItem,
    //   data: {
    //     products,
    //   },
    // });
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

exports.showDetailProductHandler = async (req, res) => {
  const id = req.params.id * 1;
  const product = await ProductDAO.getProductsById(id);
  const imgs = await ProductDAO.getAllImgProductByIdProduct(id);
  const options = await ProductDAO.getAllOptionsByIdProduct(id);
  // product.options = options;
  const uniqueSizes = [...new Set(options.map((opt) => opt.size))];
  const uniqueColors = [...new Set(options.map((opt) => opt.color))];

  const sortedOptions = options.sort((a, b) => {
    if (a.size !== b.size) {
      return a.size - b.size;
    } else {
      return a.color.localeCompare(b.color);
    }
  });
  product.imgs = imgs;
  product.options = sortedOptions;
  product.uniqueSizes = uniqueSizes;
  product.uniqueColors = uniqueColors;
  if (!product) {
    res.send(`<h1>Can not find Product with id = ${id} </h1>`);
  } else {
    res.render("product", {
      title: "Product",
      linkcss: "/css/product.css",
      linkjs: "/js/product.js",
      product,
    });
  }
};

exports.showTopProductHandler = async (req, res) => {
  try {
    const { page, pageSize, totalPage, totalItem, products } =
      await ProductDAO.getAllProducts(req.query);

    const productPartialData = {
      products: products.slice(0, 4),
    };

    res.render("home", {
      title: "Home",
      linkcss: "/css/home.css",
      productPartialData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.showPhoneHandler = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const { page, pageSize, totalPage, totalItem, products } =
      await ProductDAO.getAllProductsByCategory(req.query, "Phones");

    const pages = [];
    for (let i = 1; i <= totalPage; i++) {
      pages.push({
        page: i,
        active: i === page,
      });
    }
    console.log(typeof page);
    const isFirstPage = page !== 1 && totalPage > 1;
    const isLastPage = page !== totalPage && totalPage > 1;

    const productPartialData = {
      products: products,
      totalPage: totalPage,
      pages: pages,
      isFirstPage: isFirstPage,
      isLastPage: isLastPage,
      nextPage: page + 1,
      prevPage: page - 1,
    };
    if (id === page) {
      productPartialData.pages[id - 1].active = true;
    }

    res.render("shop", {
      title: "Shop",
      linkcss: "/css/shop.css",
      productPartialData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.showLaptopHandler = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const { page, pageSize, totalPage, totalItem, products } =
      await ProductDAO.getAllProductsByCategory(req.query, "Laptops");

    const pages = [];
    for (let i = 1; i <= totalPage; i++) {
      pages.push({
        page: i,
        active: i === page,
      });
    }
    console.log(typeof page);
    const isFirstPage = page !== 1 && totalPage > 1;
    const isLastPage = page !== totalPage && totalPage > 1;

    const productPartialData = {
      products: products,
      url: req.url,
      totalPage: totalPage,
      pages: pages,
      isFirstPage: isFirstPage,
      isLastPage: isLastPage,
      nextPage: page + 1,
      prevPage: page - 1,
    };
    if (id === page) {
      productPartialData.pages[id - 1].active = true;
    }

    res.render("shop", {
      title: "Shop",
      linkcss: "/css/shop.css",
      productPartialData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.createProductHandler = async (req, res) => {
  const product = req.body;
  try {
    await ProductDAO.createNewProduct(product);
    const newProduct = await ProductDAO.getProductByCreatedAt(
      product.createdAt
    );
    let result = {
      code: 200,
      msg: "Booking Successful!",
      data: {
        newProduct,
      },
    };
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.checkProductById = async (req, res, next, val) => {
  try {
    const id = val;
    let product = await ProductDAO.getProductById(id);
    if (!product) {
      return res.status(404).json({
        code: 404,
        msg: `Not found product with id ${id}`,
      });
    }
    req.product = product;
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

exports.getProductHandler = async (req, res) => {
  try {
    const product = req.product;
    let result = {
      code: 200,
      msg: "OK",
      data: { product },
    };
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

//Anh nam tạ works
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id * 1;
    await ProductCartDAO.deleteProductCartById(id);
    await ProductDAO.deleteProductById(id);
    return res.status(200).json({
      code: 200,
      msg: `Delete product with ${id} successfully!`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};
//checked ok
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const updateInfo = req.body;
    await ProductDAO.updateProductById(id, updateInfo);
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
//checked
exports.createProducts = async (req, res) => {
  const newProduct = req.body;
  try {
    const now = new Date();
    const options = { timeZone: "Asia/Ho_Chi_Minh" };
    const vietnamTime = now.toLocaleString("en-US", options);

    await ProductDAO.createProducts(newProduct);
    const product = await ProductDAO.getProductByCreatedAt(vietnamTime);
    return res.status(200).json({
      code: 200,
      msg: "Create new products successfully!",
      data: { product },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};
