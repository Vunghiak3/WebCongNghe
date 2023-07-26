const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const RoleSchema = new ModelSchema(
    {
      roleId: new ModelSchemaValidator({
        name: "roleId",
        sqlType: sql.Int,
        primary: true,
        identity: true,
      }),
      roleName: new ModelSchemaValidator({
        name: "roleName",
        sqlType: sql.NVarChar,
        maxLength: 30,
        unique: true,
        require: true,
      }),
      createdAt: new ModelSchemaValidator({
        name: "createdAt",
        sqlType: sql.DateTime,
        require: true,
        default: "CURRENT_TIMESTAMP",
      }),
    },
    "Roles",
    "createdAt"
  );
  
  module.exports = RoleSchema;