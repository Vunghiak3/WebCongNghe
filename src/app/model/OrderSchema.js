const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const OrderSchema = new ModelSchema(
  {
    orderId: new ModelSchemaValidator({
      name: "orderId",
      sqlType: sql.Int,
      primary: true,
      identity: true,
    }),
    userId: new ModelSchemaValidator({
      name: "userId",
      sqlType: sql.Int,
      require: true,
    }),
    shippingAddress: new ModelSchemaValidator({
      name: "shippingAddress",
      sqlType: sql.Text,
      require: true,
    }),
    orderStatus: new ModelSchemaValidator({
      name: "orderStatus",
      sqlType: sql.VarChar,
      maxLength: 100,
      require: true,
    }),
    totalAmount: new ModelSchemaValidator({
      name: "totalAmount",
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
  "Orders",
  "createdAt"
);

module.exports = OrderSchema;
