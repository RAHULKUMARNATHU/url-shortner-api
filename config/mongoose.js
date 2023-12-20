const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

let DB;
if (process.env.NODE_ENV === "production") {
  DB = process.env.PROD_DATABASE;
} else {
  DB = process.env.LOCAL_DATABASE;
}
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connection successfully!");
  });

module.exports = DB;
