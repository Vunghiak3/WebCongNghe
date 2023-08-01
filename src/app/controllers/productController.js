const ProductDAO = require("./../../DAO/ProductDAO");
const ProductCartDAO = require("./../../DAO/ProductCartDAO");
const ProductCategoriesDAO = require("./../../DAO/ProductCategoriesDAO");
const ProductOptionDAO = require("./../../DAO/ProductOptionDAO");
const jwt = require("jsonwebtoken");
const querystring = require("querystring");

exports.showTopProductsForHome = async (req, res) => {
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
exports.showProductsForShop = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const { page, pageSize, totalPage, totalItem, products } =
      await ProductDAO.getAllProducts(req.query);

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

    await Promise.all(
      products.map(async (product) => {
        product.price = product.price.toLocaleString("vi-VN") + " VND";
      })
    );

    const productPartialData = {
      products: products,
      totalPage: totalPage,
      pages: pages,
      isFirstPage: isFirstPage,
      isLastPage: isLastPage,
    };

    if (id === page) {
      productPartialData.pages[id - 1].active = true;
    }

    return res.render("shop", {
      title: "Shop",
      linkcss: "/css/shop.css",
      productPartialData,
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
exports.showProductsForManager = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const { page, pageSize, totalPage, totalItem, products } =
      await ProductDAO.getAllProducts(req.query);
    await Promise.all(
      products.map(async (product) => {
        const category = await ProductCategoriesDAO.getCategoryById(
          product.categoryId
        );
        product.categoryName = category.categoryName;
        product.price = product.price.toLocaleString("vi-VN") + " VND";
      })
    );
    const category = await ProductCategoriesDAO.getAllCategory();
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
      products: products,
      totalPage: totalPage,
      pages: pages,
      isFirstPage: isFirstPage,
      isLastPage: isLastPage,
      category,
    };

    if (id === page) {
      productPartialData.pages[id - 1].active = true;
    }

    return res.render("manager", {
      title: "Manager",
      linkjs: "/js/manager.js",
      linkcss: "/css/manager.css",
      productPartialData,
      isProduct: true,
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

//Show FORM
exports.showDetailProductHandler = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const product = await ProductDAO.getProductById(id);
    const imgs = await ProductDAO.getAllImgProductByIdProduct(id);
    product.imgs = imgs;
    product.price = product.price.toLocaleString("vi-VN") + " VND";
    const sizes = await ProductOptionDAO.getOptionSizeById(id);
    const colors = await ProductOptionDAO.getOptionColorById(id);
    if (!product) {
      res.send(`<h1>Can not find Product with id = ${id} </h1>`);
    } else {
      res.render("product", {
        title: "Product",
        linkcss: "/css/product.css",
        linkjs: "/js/product.js",
        product,
        sizes,
        colors
      });
    }
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
exports.showFormCreateProduct = async (req, res) => {
  try {
    const categories = await ProductCategoriesDAO.getAllCategory();
    return res.render("createNew/newProduct", {
      title: "Create new Product",
      linkcss: "/css/newProduct.css",
      categories,
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
exports.showFormUpdateProdct = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const product = await ProductDAO.getProductById(id);
    const category = await ProductCategoriesDAO.getAllCategory();
    const categoryId = product.categoryId;
    category.sort((a, b) => {
      if (a.categoryId === categoryId) {
        return -1; // Đưa danh mục sản phẩm liên quan đến sản phẩm được chọn lên đầu danh sách
      } else if (b.categoryId === categoryId) {
        return 1;
      } else {
        return 0;
      }
    });
    return res.render("update/updateProduct", {
      title: "Update Product",
      linkcss: "/css/newProduct.css",
      product,
      category,
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
exports.createProductHandler = async (req, res) => {
  const product = req.body;
  try {
    req.body.price = parseFloat(req.body.price);
    const category = await ProductCategoriesDAO.getProductCategoryByName(
      req.body.categoryName
    );
    req.body.categoryId = category.categoryId;
    await ProductDAO.createNewProduct(product);
    // const newProduct = await ProductDAO.getProductByCreatedAt(
    // product.createdAt
    // );
    res.redirect("/Manager/Product");
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

//UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id * 1;
    req.body.price = parseFloat(req.body.price);
    req.body.quantity = parseFloat(req.body.quantity);
    const category = await ProductCategoriesDAO.getProductCategoryByName(
      req.body.categoryName
    );
    req.body.categoryId = category.categoryId;
    const updateInfo = req.body;
    await ProductDAO.updateProductById(id, updateInfo);
    // const product = await ProductDAO.getProductById(id);
    return res.redirect("/Manager/Product");
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

//DELETE
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id * 1;
    await ProductCartDAO.deleteProductCartById(id);
    await ProductDAO.deleteProductById(id);
    return res.redirect("/Manager/Product");
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};
/////////////////////////////////////////////////

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

//Anh nam tạ work
//checked ok
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
