const ProductOptionDAO = require("./../../DAO/ProductOptionDAO");

exports.getOption = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const options = await ProductOptionDAO.getOptionById(id);
    console.log(
      "🚀 ~ file: ProductOptionController.js:7 ~ exports.getOption= ~ options:",
      options
    );
  } catch (e) {
    res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};
