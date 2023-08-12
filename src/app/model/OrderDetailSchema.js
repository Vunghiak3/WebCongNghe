const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const OrderDetailSchema = new ModelSchema(
  {
    orderDetailId: new ModelSchemaValidator({
      name: "orderDetailId",
      sqlType: sql.Int,
      primary: true,
      identity: true,
    }),
    orderId: new ModelSchemaValidator({
      name: "orderId",
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
    price: new ModelSchemaValidator({
      name: "price",
      sqlType: sql.Float,
      require: true,
    }),
    totalPrice: new ModelSchemaValidator({
      name: "totalPrice",
      sqlType: sql.Float,
      require: true,
    }),
    createdAt: new ModelSchemaValidator({
      name: "createdAt",
      sqlType: sql.DateTime,
      require: true,
      default: "CURRENT_TIMESTAMP",
    }),
  },
  "OrdersDetails",
  "createdAt"
);

module.exports = OrderDetailSchema;
