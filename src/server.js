const sql = require("mssql");
const dotenv = require("dotenv");
dotenv.config({
  path: __dirname + "/./config/config.env",
});
const app = require("./app");
const dbConfig = require("./config/dbconfig");

const appPool = new sql.ConnectionPool(dbConfig.sqlConfig);
appPool
  .connect()
  .then((pool) => {
    console.log("SQL Connected!");
    dbConfig.db.pool = pool;
  })
  .catch((e) => {
    console.error(e);
  });

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
