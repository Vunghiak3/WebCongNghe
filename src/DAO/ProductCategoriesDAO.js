const dbUtils = require("./../utils/dbUtils");
const StaticData = require("./../utils/StaticData");
const dbConfig = require("../config/dbconfig");
const ProductCategoriesSchema = require("../app/model/ProductCategories");

exports.getAllProductCategory = async (filter) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let query = `SELECT * FROM ${ProductCategoriesSchema.schemaName} `;
  let countQuery = `SELECT COUNT(*) AS totalItem FROM ${ProductCategoriesSchema.schemaName}`;
  const page = filter.page * 1 || 1;
  let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
  if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
    pageSize = StaticData.config.MAX_PAGE_SIZE;
  }
  const { filterStr, paginationStr } = dbUtils.getFilterQuery(
    ProductCategoriesSchema.schema,
    filter,
    page,
    pageSize,
    ProductCategoriesSchema.schema.createdAt.name
  );

  if (filterStr) {
    query += " " + filterStr;
    countQuery += " " + filterStr;
  }
  if (paginationStr) {
    query += " " + paginationStr;
  }
  let result = await dbConfig.db.pool.request().query(query);
  const countResult = await dbConfig.db.pool.request().query(countQuery);
  let totalItem = 0;
  if (countResult.recordsets[0].length > 0) {
    totalItem = countResult.recordsets[0][0].totalItem;
  }
  let totalPage = Math.ceil(totalItem / pageSize);
  let categories = result.recordsets[0];

  return {
    page,
    pageSize,
    totalPage,
    totalItem,
    categories: categories,
  };
};

exports.getProductCategoryByName = async (name) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductCategoriesSchema.schema.categoryName.name,
      ProductCategoriesSchema.schema.categoryName.sqlType,
      name
    )
    .query(
      `SELECT * FROM ${ProductCategoriesSchema.schemaName} WHERE ${ProductCategoriesSchema.schema.categoryName.name} = '${name}'`
    );
  let categoryId = result.recordsets[0][0];
  return categoryId;
};

exports.getCategoryById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request.query(
    `SELECT * FROM ${ProductCategoriesSchema.schemaName} WHERE ${ProductCategoriesSchema.schema.categoryId.name} = '${id}'`
  );
  let categoryName = result.recordsets[0][0];
  return categoryName;
};

exports.getAllCategory = async () => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request.query(
    `SELECT * FROM ${ProductCategoriesSchema.schemaName} `
  );
  let categories = result.recordsets[0];
  return categories;
};

exports.createNewProductCategory = async (category) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!category) {
    throw new Error("Invalid input params!");
  }
  const now = new Date();
  const options = { timeZone: "Asia/Ho_Chi_Minh" };
  const vietnamTime = now.toLocaleString("en-US", options);
  category.createdAt = vietnamTime;
  let insertData = ProductCategoriesSchema.validateData(category);
  let query = `INSERT INTO ${ProductCategoriesSchema.schemaName}`;

  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      ProductCategoriesSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  query += " (" + insertFieldNamesStr + ") VALUES (" + insertValuesStr + ")";
  let result = await request.query(query);
  return result.recordsets;
};

exports.updateProductCategory = async (id, updateInfo) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!updateInfo) {
    throw new Error("Invalid input param!");
  }
  let query = `UPDATE ${ProductCategoriesSchema.schemaName} SET`;
  const { request, updateStr } = dbUtils.getUpdateQuery(
    ProductCategoriesSchema.schema,
    dbConfig.db.pool.request(),
    updateInfo
  );
  if (!updateStr) {
    throw new Error("Invalid update param!");
  }
  request.input(
    ProductCategoriesSchema.schema.categoryId.name,
    ProductCategoriesSchema.schema.categoryId.sqlType,
    id
  );
  query +=
    " " +
    updateStr +
    ` WHERE ${ProductCategoriesSchema.schema.categoryId.name} = @${ProductCategoriesSchema.schema.categoryId.name}`;
  let result = await request.query(query);
  return result.recordsets;
};

exports.deleteProductCategory = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductCategoriesSchema.schema.categoryId.name,
      ProductCategoriesSchema.schema.categoryId.sqlType,
      id
    )
    .query(
      `delete from ${ProductCategoriesSchema.schemaName} where ${ProductCategoriesSchema.schema.categoryId.name} = @${ProductCategoriesSchema.schema.categoryId.name}`
    );
  return result.recordsets;
};
