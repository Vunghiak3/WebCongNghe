//Anh nam tạ works
const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const ProductCartSchema = new ModelSchema(
  {
    cartId: new ModelSchemaValidator({
      name: "cartId",
      sqlType: sql.Int,
      primary: true,
      identity: true,
    }),
    userId: new ModelSchemaValidator({
      name: "userId",
      sqlType: sql.Int,
      require: true,
    }),
    productId: new ModelSchemaValidator({
      name: "productId",
      sqlType: sql.Int,
      require: true,
    }),
    quantity: new ModelSchemaValidator({
      name: "quantity",
      sqlType: sql.Int,
      require: true,
    }),
    createdAt: new ModelSchemaValidator({
      name: "createdAt",
      sqlType: sql.DateTime,
      require: true,
      default: "CURRENT_TIMESTAMP",
    }),
  },
  "ProductCarts",
  "createdAt"
);

module.exports = ProductCartSchema;
