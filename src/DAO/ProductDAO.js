const ProductSchema = require("../app/model/Product");
const ProductCategoriesSchema = require("../app/model/ProductCategories");
const ProductImageSchema = require("../app/model/ProductImage");
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
