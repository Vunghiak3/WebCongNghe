const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const ProductSchema = new ModelSchema(
  {
    productId: new ModelSchemaValidator({
      name: "productId",
      sqlType: sql.Int,
      primary: true,
      identity: true,
    }),
    productName: new ModelSchemaValidator({
      name: "productName",
      sqlType: sql.NVarChar,
      require: true,
      maxLength: 250,
    }),
    description: new ModelSchemaValidator({
      name: "description",
      sqlType: sql.Text,
      require: true,
    }),
    price: new ModelSchemaValidator({
      name: "price",
      sqlType: sql.Decimal,
      require: true,
      precision: 10,
      scale: 2,
    }),
    quantity: new ModelSchemaValidator({
      name: "quantity",
      sqlType: sql.Int,
      require: true,
    }),
    categoryId: new ModelSchemaValidator({
      name: "categoryId",
      sqlType: sql.Int,
      foreignKey: {
        table: "ProductCategories",
        column: "categoryId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      require: true,
    }),
    createdAt: new ModelSchemaValidator({
      name: "createdAt",
      sqlType: sql.DateTime,
      require: true,
      default: "CURRENT_TIMESTAMP",
    }),
  },
  "Products",
  "createdAt"
);

module.exports = ProductSchema;
