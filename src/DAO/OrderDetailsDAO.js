const dbUtils = require("./../utils/dbUtils");
const StaticData = require("./../utils/StaticData");
const dbConfig = require("../config/dbconfig");
const OrderDetailSchema = require("../app/model/OrderDetailSchema");

//get all order details
exports.getallOrderDetails = async () => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request.query(
    `SELECT * from ${OrderDetailSchema.schemaName}`
  );
  let details = result.recordsets[0][0];
  return details;
};
//get by order id
exports.getDetailByOrderId = async (orderId) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      OrderDetailSchema.schema.orderId.name,
      OrderDetailSchema.schema.orderId.sqlType,
      orderId
    )
    .query(
      `SELECT * from ${OrderDetailSchema.schemaName} 
          where ${OrderDetailSchema.schema.orderId.name} =@${ProductCartSchema.schema.orderId.name}`
    );
  let details = result.recordsets[0][0];
  return details;
};
//delete by orderDetailId
exports.deleteOrderDetailsById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      OrderDetailSchema.schema.orderDetailId.name,
      OrderDetailSchema.schema.orderDetailId.sqlType,
      id
    )
    .query(
      `delete from ${OrderDetailSchema.schemaName} 
          where ${OrderDetailSchema.schema.orderDetailId.name} = @${ProductCartSchema.schema.orderDetailId.name}`
    );
  return result.recordsets;
};
//update by orderDetailId
exports.updateOrderDetails = async (id, updateInfo) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!updateInfo) {
    throw new Error("Invalid input param!");
  }
  let query = `UPDATE ${OrderDetailSchema.schemaName} SET`;
  const { request, updateStr } = dbUtils.getUpdateQuery(
    OrderDetailSchema.schema,
    dbConfig.db.pool.request(),
    updateInfo
  );
  if (!updateStr) {
    throw new Error("Invalid update param!");
  }
  request.input(
    OrderDetailSchema.schema.orderDetailId.name,
    OrderDetailSchema.schema.orderDetailId.sqlType,
    id
  );

  query +=
    " " +
    updateStr +
    ` WHERE ${OrderDetailSchema.schema.orderDetailId.name} = @${OrderDetailSchema.schema.orderDetailId.name}`;
  let result = await request.query(query);
  return result.recordsets;
};
