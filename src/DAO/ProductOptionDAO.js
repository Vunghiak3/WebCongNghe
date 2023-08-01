const dbConfig = require("../config/dbconfig");
const ProductOptionSchema = require("../app/model/ProductOptions");

exports.getOptionById = async (productId) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductOptionSchema.schema.productId.name,
      ProductOptionSchema.schema.productId.sqlType,
      productId
    )
    .query(
      `SELECT * FROM ${ProductOptionSchema.schemaName} WHERE ${ProductOptionSchema.schema.productId.name} = @productId`
    );
  return result.recordsets[0];
};

exports.getOptionSizeById = async(productId)=>{
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductOptionSchema.schema.productId.name,
      ProductOptionSchema.schema.productId.sqlType,
      productId
    )
    .query(
      `SELECT DISTINCT ${ProductOptionSchema.schema.size.name} FROM ${ProductOptionSchema.schemaName} WHERE ${ProductOptionSchema.schema.productId.name} = @productId`
    );
  return result.recordsets[0];
}
exports.getOptionColorById = async(productId)=>{
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductOptionSchema.schema.productId.name,
      ProductOptionSchema.schema.productId.sqlType,
      productId
    )
    .query(
      `SELECT DISTINCT ${ProductOptionSchema.schema.color.name} FROM ${ProductOptionSchema.schemaName} WHERE ${ProductOptionSchema.schema.productId.name} = @productId`
    );
  return result.recordsets[0];
}
