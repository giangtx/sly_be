import Sequelize from "sequelize";
require("dotenv").config();

const { DBNAME, DB_USERNAME, PASSWORD, HOST, dialect } = process.env;

export const sequelize = new Sequelize(
  DBNAME, //db name
  DB_USERNAME, //username
  PASSWORD, //password
  {
    dialect,
    host: HOST,
    operatorsAliases: 0,
    pool: {
      max: 5,
      min: 0,
      require: 30000,
      idle: 10000,
    },
  }
);
export const Op = Sequelize.Op;
