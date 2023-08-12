const dbUtils = require("./../utils/dbUtils");
const StaticData = require("./../utils/StaticData");
const dbConfig = require("../config/dbconfig");
const OrderSchema = require("../app/model/OrderSchema");

//GetAllOrder
exports.getOrder = async () => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request.query(`SELECT * from ${OrderSchema.schemaName}`);
  let order = result.recordsets[0][0];
  return order;
};
//get order by user id
exports.getOrderByUserId = async (userId) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
  .input(
      OrderSchema.schema.userId.name,
      OrderSchema.schema.userId.sqlType,
      userId
  )
  .query(
      `SELECT * from ${OrderSchema.schemaName} 
      where ${OrderSchema.schema.userId.name} =@${OrderSchema.schema.userId.name}`
  );
let orders = result.recordsets[0];
return orders;
};
//get order id
exports.getOrderById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      OrderSchema.schema.orderId.name,
      OrderSchema.schema.orderId.sqlType,
      id
    )
    .query(
      `SELECT * from ${OrderSchema.schemaName} 
          where ${OrderSchema.schema.orderId.name} =@${OrderSchema.schema.orderId.name}`
    );
  let order = result.recordsets[0][0];
  return order;
};
//DeleteOrder
exports.deleteOrderById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      OrderSchema.schema.orderId.name,
      OrderSchema.schema.orderId.sqlType,
      id
    )
    .query(
      `delete from ${OrderSchema.schemaName} where ${OrderSchema.schema.productId.name} = @${ProductSchema.schema.productId.name}`
    );
  return result.recordsets;
};
//updateOrder
exports.updateOrderById = async (id, updateInfo) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!updateInfo) {
    throw new Error("Invalid input param!");
  }
  let query = `UPDATE ${OrderSchema.schemaName} SET`;
  const { request, updateStr } = dbUtils.getUpdateQuery(
    OrderSchema.schema,
    dbConfig.db.pool.request(),
    updateInfo
  );
  if (!updateStr) {
    throw new Error("Invalid update param!");
  }
  request.input(
    OrderSchema.schema.orderId.name,
    OrderSchema.schema.orderId.sqlType,
    id
  );
  query +=
    " " + updateStr + ` WHERE ${OrderSchema.schema.orderId.name} = @productId`;
  let result = await request.query(query);
  return result.recordsets;
};
//createNewOder
exports.createNewOrder = async (order) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!product) {
    throw new Error("Invalid input params!");
  }
  const now = new Date();
  const options = { timeZone: "Asia/Ho_Chi_Minh" };
  const vietnamTime = now.toLocaleString("en-US", options);
  order.createdAt = vietnamTime;
  let insertData = OrderSchema.validateData(order);
  let query = `INSERT INTO ${OrderSchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      OrderSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  query += " (" + insertFieldNamesStr + ") VALUES (" + insertValuesStr + ")";
  let result = await request.query(query);
  return result.recordsets;
};
