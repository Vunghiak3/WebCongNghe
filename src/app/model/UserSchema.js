const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const UserSchema = new ModelSchema(
  {
    userId: new ModelSchemaValidator({
      name: "userId",
      sqlType: sql.Int,
      primaryKey: true,
      aidentity: true,
    }),
    username: new ModelSchemaValidator({
      name: "username",
      sqlType: sql.VarChar,
      maxLength: 50,
      unique: true,
      require: true,
    }),
    password: new ModelSchemaValidator({
      name: "password",
      sqlType: sql.VarChar,
      maxLength: 250,
      require: true,
    }),
    email: new ModelSchemaValidator({
      name: "email",
      sqlType: sql.VarChar,
      require: true,
      validator: function (val) {
        return String(val)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      },
    }),
    name: new ModelSchemaValidator({
      name: "name",
      sqlType: sql.NVarChar,
      maxLength: 250,
      require: true,
    }),
    address: new ModelSchemaValidator({
      name: "address",
      sqlType: sql.Text,
      require: true,
    }),
    phone: new ModelSchemaValidator({
      name: "phone",
      sqlType: sql.VarChar,
      maxLength: 20,
    }),
    roleId: new ModelSchemaValidator({
      name: "roleId",
      sqlType: sql.Int,
      foreignKey: {
        table: "Roles",
        column: "roleId",
        require: true,
      },
    }),
    createdAt: new ModelSchemaValidator({
      name: "createdAt",
      sqlType: sql.DateTime,
      require: true,
      defaultValue: "CURRENT_TIMESTAMP",
    }),
  },
  "Users",
  "createdAt"
);

module.exports = UserSchema;