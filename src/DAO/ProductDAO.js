const ProductSchema = require("../app/model/Product");
const ProductCategoriesSchema = require("../app/model/ProductCategories");
const ProductImageSchema = require("../app/model/ProductImage");
const ProductOptionSchema = require("../app/model/ProductOptions");
const dbUtils = require("./../utils/dbUtils");
const StaticData = require("./../utils/StaticData");
const dbConfig = require("../config/dbconfig");

exports.getAllProducts = async (filter) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let query = `
  SELECT p.*, c.${ProductCategoriesSchema.schema.categoryName.name}, i.${ProductImageSchema.schema.imageId.name}, i.${ProductImageSchema.schema.imageName.name}, i.${ProductImageSchema.schema.imageURL.name}, i.${ProductImageSchema.schema.isPrimary.name}
  FROM ${ProductSchema.schemaName} p
  INNER JOIN ${ProductCategoriesSchema.schemaName} c ON p.${ProductSchema.schema.categoryId.name} = c.${ProductCategoriesSchema.schema.categoryId.name}
  INNER JOIN ${ProductImageSchema.schemaName} i ON p.${ProductSchema.schema.productId.name} = i.${ProductImageSchema.schema.productId.name}
  WHERE i.${ProductImageSchema.schema.isPrimary.name} = 'true'
`;

  let countQuery = `SELECT COUNT(*) AS totalItem FROM ${ProductSchema.schemaName} p INNER JOIN ${ProductCategoriesSchema.schemaName} c ON p.${ProductSchema.schema.categoryId.name} = c.${ProductCategoriesSchema.schema.categoryId.name} INNER JOIN ${ProductImageSchema.schemaName} i ON p.${ProductSchema.schema.productId.name} = i.${ProductImageSchema.schema.productId.name} WHERE i.${ProductImageSchema.schema.isPrimary.name} = 'true'`;
  const page = filter.page * 1 || 1;
  let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
  if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
    pageSize = StaticData.config.MAX_PAGE_SIZE;
  }
  const { filterStr, paginationStr } = dbUtils.getFilterQuery(
    ProductSchema.schema,
    filter,
    page,
    pageSize,
    "p." + ProductSchema.schema.createdAt.name
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
  let products = result.recordsets[0];

  return {
    page,
    pageSize,
    totalPage,
    totalItem,
    products: products,
  };
};

exports.getAllProductsByCategory = async (filter, category) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let query = `
  SELECT p.*, c.${ProductCategoriesSchema.schema.categoryName.name}, i.${ProductImageSchema.schema.imageId.name}, i.${ProductImageSchema.schema.imageName.name}, i.${ProductImageSchema.schema.imageURL.name}, i.${ProductImageSchema.schema.isPrimary.name}
  FROM ${ProductSchema.schemaName} p
  INNER JOIN ${ProductCategoriesSchema.schemaName} c ON p.${ProductSchema.schema.categoryId.name} = c.${ProductCategoriesSchema.schema.categoryId.name}
  INNER JOIN ${ProductImageSchema.schemaName} i ON p.${ProductSchema.schema.productId.name} = i.${ProductImageSchema.schema.productId.name}
  WHERE c.${ProductCategoriesSchema.schema.categoryName.name} = @categoryName AND i.${ProductImageSchema.schema.isPrimary.name} = 'true'
`;

  let countQuery = `SELECT COUNT(*) AS totalItem FROM ${ProductSchema.schemaName} p INNER JOIN ${ProductCategoriesSchema.schemaName} c ON p.${ProductSchema.schema.categoryId.name} = c.${ProductCategoriesSchema.schema.categoryId.name} INNER JOIN ${ProductImageSchema.schemaName} i ON p.${ProductSchema.schema.productId.name} = i.${ProductImageSchema.schema.productId.name} WHERE c.${ProductCategoriesSchema.schema.categoryName.name} = @categoryName AND i.${ProductImageSchema.schema.isPrimary.name} = 'true'`;
  const page = filter.page * 1 || 1;
  let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
  if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
    pageSize = StaticData.config.MAX_PAGE_SIZE;
  }
  const { filterStr, paginationStr } = dbUtils.getFilterQuery(
    ProductSchema.schema,
    filter,
    page,
    pageSize,
    "p." + ProductSchema.schema.createdAt.name
  );

  if (filterStr) {
    query += " " + filterStr;
    countQuery += " " + filterStr;
  }
  if (paginationStr) {
    query += " " + paginationStr;
  }
  let result = await dbConfig.db.pool
    .request()
    .input(
      ProductCategoriesSchema.schema.categoryName.name,
      ProductCategoriesSchema.schema.categoryName.sqlType,
      category
    )
    .query(query);
  const countResult = await dbConfig.db.pool
    .request()
    .input(
      ProductCategoriesSchema.schema.categoryName.name,
      ProductCategoriesSchema.schema.categoryName.sqlType,
      category
    )
    .query(countQuery);
  let totalItem = 0;
  if (countResult.recordsets[0].length > 0) {
    totalItem = countResult.recordsets[0][0].totalItem;
  }
  let totalPage = Math.ceil(totalItem / pageSize);
  let products = result.recordsets[0];

  return {
    page,
    pageSize,
    totalPage,
    totalItem,
    products: products,
  };
};

exports.getProductsById = async (productId) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductSchema.schema.productId.name,
      ProductSchema.schema.productId.sqlType,
      productId
    )
    .query(
      `SELECT p.*, i.${ProductImageSchema.schema.imageURL.name}
      FROM ${ProductSchema.schemaName} p
      INNER JOIN ${ProductImageSchema.schemaName} i ON p.${ProductSchema.schema.productId.name} = i.${ProductImageSchema.schema.productId.name}
      WHERE p.${ProductSchema.schema.productId.name} = @productId
      AND i.${ProductImageSchema.schema.isPrimary.name} = 'true'`
    );
  let product = result.recordsets[0][0];
  return product;
};

exports.getAllImgProductByIdProduct = async (productId) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductImageSchema.schema.productId.name,
      ProductImageSchema.schema.productId.sqlType,
      productId
    )
    .query(
      `SELECT i.*, p.${ProductSchema.schema.productId.name}, p.${ProductSchema.schema.productName.name}
      FROM ${ProductImageSchema.schemaName} i
      INNER JOIN ${ProductSchema.schemaName} p ON p.${ProductSchema.schema.productId.name} = i.${ProductImageSchema.schema.productId.name}
      WHERE p.${ProductSchema.schema.productId.name} = @productId`
    );
  let imgProducts = result.recordsets[0];
  return imgProducts;
};

exports.getAllOptionsByIdProduct = async (productId) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductImageSchema.schema.productId.name,
      ProductImageSchema.schema.productId.sqlType,
      productId
    )
    .query(
      `SELECT o.* FROM ${ProductOptionSchema.schemaName} o WHERE o.${ProductOptionSchema.schema.productId.name} = @productId`
    );
  let optionsProduct = result.recordsets[0];
  return optionsProduct;
};

exports.createNewProduct = async (product) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!product) {
    throw new Error("Invalid input params!");
  }
  const now = new Date();
  const options = { timeZone: "Asia/Ho_Chi_Minh" };
  const vietnamTime = now.toLocaleString("en-US", options);
  product.createdAt = vietnamTime;
  let insertData = ProductSchema.validateData(product);
  let query = `INSERT INTO ${ProductSchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      ProductSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  query += " (" + insertFieldNamesStr + ") VALUES (" + insertValuesStr + ")";
  let result = await request.query(query);
  return result.recordsets;
};

exports.getProductByCreatedAt = async (createdAt) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductSchema.schema.createdAt.name,
      ProductSchema.schema.createdAt.sqlType,
      createdAt
    )
    .query(
      `SELECT p.*
      FROM ${ProductSchema.schemaName} p
      WHERE p.${ProductSchema.schema.createdAt.name} = @createdAt`
    );
  let product = result.recordsets[0][0];
  return product;
};

exports.getProductById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductSchema.schema.productId.name,
      ProductSchema.schema.productId.sqlType,
      id
    )
    .query(
      `SELECT * FROM ${ProductSchema.schemaName} WHERE ${ProductSchema.schema.productId.name} = @${ProductSchema.schema.productId.name}`
    );
  let product = result.recordsets[0][0];
  return product;
};

//Anh nam tạ works
exports.deleteProductById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ProductSchema.schema.productId.name,
      ProductSchema.schema.productId.sqlType,
      id
    )
    .query(
      `delete from ${ProductSchema.schemaName} where ${ProductSchema.schema.productId.name} = @${ProductSchema.schema.productId.name}`
    );
  return result.recordsets;
};

exports.updateProductById = async (id, updateInfo) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!updateInfo) {
    throw new Error("Invalid input param!");
  }
  let query = `UPDATE ${ProductSchema.schemaName} SET`;
  const { request, updateStr } = dbUtils.getUpdateQuery(
    ProductSchema.schema,
    dbConfig.db.pool.request(),
    updateInfo
  );
  if (!updateStr) {
    throw new Error("Invalid update param!");
  }
  request.input(
    ProductSchema.schema.productId.name,
    ProductSchema.schema.productId.sqlType,
    id
  );
  query +=
    " " +
    updateStr +
    ` WHERE ${ProductSchema.schema.productId.name} = @${ProductSchema.schema.productId.name}`;
  let result = await request.query(query);
  return result.recordsets;
};
//CHECKED
exports.createProducts = async (product) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!product) {
    throw new Error("Invalid input param!");
  }
  const now = new Date();
  const options = { timeZone: "Asia/Ho_Chi_Minh" };
  const vietnamTime = now.toLocaleString("en-US", options);
  product.createdAt = vietnamTime;
  let insertData = ProductSchema.validateData(product);
  let query = `INSERT INTO ${ProductSchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      ProductSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  query += " (" + insertFieldNamesStr + ") VALUES (" + insertValuesStr + ")";
  let result = await request.query(query);
  return result.recordsets;
};
