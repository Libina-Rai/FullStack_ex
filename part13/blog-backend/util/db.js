const { Pool } = require("pg");
const { Sequelize } = require("sequelize");

require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_SSL === "false"
      ? false
      : {
          rejectUnauthorized: process.env.NODE_ENV === "production",
        },
});

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions:
    process.env.DATABASE_SSL === "false"
      ? {}
      : {
          ssl: {
            require: true,
            rejectUnauthorized: process.env.NODE_ENV === "production",
          },
        },
});

module.exports = {
  pool,
  sequelize,
};
