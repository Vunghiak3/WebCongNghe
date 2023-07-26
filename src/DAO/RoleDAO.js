const RoleSchema = require("../app/model/Role");
const dbConfig = require("../config/dbconfig");

exports.getRoleById = async (roleId) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      RoleSchema.schema.roleId.name,
      RoleSchema.schema.roleId.sqlType,
      roleId
    )
    .query(
      `SELECT * FROM ${RoleSchema.schemaName} WHERE ${RoleSchema.schema.roleId.name} = @roleId`
    );
  let product = result.recordsets[0][0];
  return product;
};

exports.getRoleByName = async (roleName) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      RoleSchema.schema.roleName.name,
      RoleSchema.schema.roleName.sqlType,
      roleName
    )
    .query(
      `SELECT * FROM ${RoleSchema.schemaName} WHERE ${RoleSchema.schema.roleName.name} = @roleName`
    );
  let product = result.recordsets[0][0];
  return product;
};

exports.getAllRole = async () => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request.query(`SELECT * FROM ${RoleSchema.schemaName}`);
  let role = result.recordsets[0];
  return role;
};
