//Anh nam tạ works
const ProductCartSchema = require("../app/model/ProductCart");
const dbUtils = require("./../utils/dbUtils");
const StaticData = require("./../utils/StaticData");
const dbConfig = require("../config/dbconfig");
const ProductSchema = require("../app/model/Product");
//Xoa hang trong gio hang cua User "not checked"
exports.deleteUserProductCart = async (cartId, userId) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductCartSchema.schema.cartId.name,
      ProductCartSchema.schema.cartId.sqlType,
      cartId
    )
    .input(
      ProductCartSchema.schema.userId.name,
      ProductCartSchema.schema.userId.sqlType,
      userId
    )
    .query(
      `delete from ${ProductCartSchema.schemaName} 
        where ${ProductCartSchema.schema.cartId.name} = @cartId and ${ProductCartSchema.schema.userId.name} = @userId`
    );
  return result.recordsets;
};
//update so luong hang "not checked"
exports.updateQuantityByUser = async (productId, userId, updateInfo) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!updateInfo) {
    throw new Error("Invalid input param!");
  }
  let query = `UPDATE ${ProductCartSchema.schemaName} SET`;
  const { request, updateStr } = dbUtils.getUpdateQuery(
    ProductCartSchema.schema,
    dbConfig.db.pool.request(),
    updateInfo
  );
  if (!updateStr) {
    throw new Error("Invalid update param!");
  }
  request
    .input(
      ProductCartSchema.schema.productId.name,
      ProductCartSchema.schema.productId.sqlType,
      productId
    )
    .input(
      ProductCartSchema.schema.userId.name,
      ProductCartSchema.schema.userId.sqlType,
      userId
    );

  query +=
    " " +
    updateStr +
    ` WHERE ${ProductCartSchema.schema.productId.name} = @${ProductCartSchema.schema.productId.name} 
        AND ${ProductCartSchema.schema.userId.name} =@${ProductCartSchema.schema.userId.name}`;
  let result = await request.query(query);
  return result.recordsets;
};
//xem gio hang "not checked"
exports.getCartByUserId = async (userId) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductCartSchema.schema.userId.name,
      ProductCartSchema.schema.userId.sqlType,
      userId
    )
    .query(
      `SELECT * from ${ProductCartSchema.schemaName} 
        where ${ProductCartSchema.schema.userId.name} =@${ProductCartSchema.schema.userId.name}`
    );
  let cart = result.recordsets[0][0];
  return cart;
};
//Unchecked
exports.deleteProductCartById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductCartSchema.schema.productId.name,
      ProductCartSchema.schema.productId.sqlType,
      id
    )
    .query(
      `delete from ${ProductCartSchema.schemaName} 
        where ${ProductCartSchema.schema.productId.name} = @${ProductCartSchema.schema.productId.name}`
    );
  return result.recordsets;
};
//Unchecked
exports.getCartById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductCartSchema.schema.cartId.name,
      ProductCartSchema.schema.cartId.sqlType,
      id
    )
    .query(
      `SELECT * FROM ${ProductCartSchema.schemaName} WHERE ${ProductCartSchema.schema.cartId.name} = @${ProductCartSchema.schema.cartId.name}`
    );
  let cart = result.recordsets[0][0];
  return cart;
};

exports.addCart = async (cart) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!cart) {
    throw new Error("Invalid input params!");
  }
  const now = new Date();
  const options = { timeZone: "Asia/Ho_Chi_Minh" };
  const vietnamTime = now.toLocaleString("en-US", options);
  cart.createdAt = vietnamTime;
  let insertData = ProductCartSchema.validateData(cart);
  let query = `INSERT INTO ${ProductCartSchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      ProductCartSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  query += " (" + insertFieldNamesStr + ") VALUES (" + insertValuesStr + ")";
  let result = await request.query(query);
  return result.recordsets;
};

exports.getAllCartByUserId = async (userId) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!userId) {
    throw new Error("Invalid input params!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductCartSchema.schema.userId.name,
      ProductCartSchema.schema.userId.sqlType,
      userId
    )
    .query(
      `SELECT p.*, c.${ProductCartSchema.schema.quantity.name} cartQuantity, c.${ProductCartSchema.schema.cartId.name} FROM ${ProductSchema.schemaName} p, ${ProductCartSchema.schemaName} c WHERE p.${ProductSchema.schema.productId.name} = c.${ProductCartSchema.schema.productId.name} AND c.${ProductCartSchema.schema.userId.name} = @userId`
    );
  let cart = result.recordsets[0];
  return cart;
};
