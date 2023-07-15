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

exports.showDetailProductHandler = async (req, res) => {
  const id = req.params.id * 1;
  const product = await ProductDAO.getProductsById(id);
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
