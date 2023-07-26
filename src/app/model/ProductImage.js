const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const ProductImageSchema = new ModelSchema(
  {
    imageId: new ModelSchemaValidator({
      name: "imageId",
      sqlType: sql.Int,
      primary: true,
      identity: true,
    }),
    productId: new ModelSchemaValidator({
      name: "productId",
      sqlType: sql.Int,
      foreignKey: {
        table: "Products",
        column: "productId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      require: true,
    }),
    imageName: new ModelSchemaValidator({
      name: "imageName",
      sqlType: sql.NVarChar,
      maxLength: 100,
    }),
    imageURL: new ModelSchemaValidator({
      name: "imageURL",
      sqlType: sql.VarChar,
      maxLength: 250,
      require: true,
    }),
    createdAt: new ModelSchemaValidator({
      name: "createdAt",
      sqlType: sql.DateTime,
      require: true,
      default: "CURRENT_TIMESTAMP",
    }),
  },
  "ProductImages",
  "createdAt"
);

module.exports = ProductImageSchema;
