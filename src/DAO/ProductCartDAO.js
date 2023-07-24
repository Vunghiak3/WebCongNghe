//Anh nam tạ works
const ProductCartSchema = require("../app/model/ProductCart");
const dbUtils = require("./../utils/dbUtils");
const StaticData = require("./../utils/StaticData");
const dbConfig = require("../config/dbconfig");
//Xoa hang trong gio hang cua User "not checked"
exports.deleteUserProductCart = async (id, userId) => {
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
    .input(
      ProductCartSchema.schema.userId.name,
      ProductCartSchema.schema.userId.sqlType,
      userId
    )
    .query(
      `delete from ${ProductCartSchema.schemaName} 
        where ${ProductCartSchema.schema.productId.name} = @${ProductCartSchema.schema.productId.name} 
        and ${ProductCartSchema.schema.userId.name} =@${ProductCartSchema.schema.userId.name}`
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
