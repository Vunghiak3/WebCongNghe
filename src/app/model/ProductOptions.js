const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const ProductOptionSchema = new ModelSchema(
  {
    productId: new ModelSchemaValidator({
      name: "productId",
      sqlType: sql.Int,
      foreignKey: {
        table: "Products",
        column: "productId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      require: true,
    }),
    size: new ModelSchemaValidator({
      name: "size",
      sqlType: sql.Int,
      require: true,
    }),
    color: new ModelSchemaValidator({
      name: "color",
      sqlType: sql.VarChar,
      maxLength: 200,
      require: true,
    }),
    quantity: new ModelSchemaValidator({
      name: "quantity",
      sqlType: sql.Int,
      require: true,
    }),
  },
  "ProductOptions",
  "createdAt"
);

module.exports = ProductOptionSchema;
