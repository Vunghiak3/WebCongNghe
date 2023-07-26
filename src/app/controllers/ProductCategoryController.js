const ProductCategoriesDAO = require("../../DAO/ProductCategoriesDAO");
const querystring = require("querystring");

exports.showCategoryProductForManager = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const { page, pageSize, totalPage, totalItem, categories } =
      await ProductCategoriesDAO.getAllProductCategory(req.query);
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
    const categoriesData = {
      categories: categories,
      totalPage: totalPage,
      isFirstPage: isFirstPage,
      isLastPage: isLastPage,
      pages: pages,
    };
    if (id === page) {
      productPartialData.pages[id - 1].active = true;
    }
    return res.render("manager", {
      title: "manager",
      linkcss: "/css/manager.css",
      isCategory: true,
      categoriesData,
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

exports.showFormCreateProductCategory = async (req, res) => {
  try {
    return res.render("createNew/newCategory", {
      title: "Create new Category",
      linkcss: "/css/newProduct.css",
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

exports.showFormUpdateProductCategory = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const category = await ProductCategoriesDAO.getCategoryById(id);
    return res.render("update/updateCategory", {
      title: "Update Category",
      linkcss: "/css/newProduct.css",
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

exports.createNewProductCategoryHandler = async (req, res) => {
  const category = req.body;
  try {
    await ProductCategoriesDAO.createNewProductCategory(category);
    res.redirect("/Manager/Category");
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

exports.updateProductCategoryHandler = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const updateInfo = req.body;
    await ProductCategoriesDAO.updateProductCategory(id, updateInfo);
    return res.redirect("/Manager/Category");
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

// exports.deleteProductCategoryHandler = async(req, res)=>{
//   try {
//     const id = req.params.id * 1;
//     await ProductCartDAO.deleteProductCartById(id);
//     await ProductDAO.deleteProductById(id);
//     return res.redirect("/Manager/Product");
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({
//       code: 500,
//       msg: e.toString(),
//     });
//   }
// }
