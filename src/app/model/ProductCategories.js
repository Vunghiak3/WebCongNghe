const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const ProductCategorySchema = new ModelSchema(
  {
    categoryId: new ModelSchemaValidator({
      name: "categoryId",
      sqlType: sql.Int,
      primary: true,
      identity: true,
    }),
    categoryName: new ModelSchemaValidator({
      name: "categoryName",
      sqlType: sql.NVarChar,
      require: true,
      maxLength: 250,
    }),
    categoryDescription: new ModelSchemaValidator({
      name: "categoryDescription",
      sqlType: sql.NVarChar,
      require: true,
      maxLength: 250,
    }),
    createdAt: new ModelSchemaValidator({
      name: "createdAt",
      sqlType: sql.DateTime,
      require: true,
      default: "CURRENT_TIMESTAMP",
    }),
  },
  "ProductCategories",
  "createdAt"
);

module.exports = ProductCategorySchema;
