import Sequelize from "sequelize";
import { sequelize, Op } from "../config/database";

const Image = sequelize.define(
  "image",
  {
    id: {
      field: "id",
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      field: "name",
      type: Sequelize.STRING,
    },
    url: {
      field: "url",
      type: Sequelize.STRING,
    },
    path: {
      field: "path",
      type: Sequelize.STRING,
    },
    type: {
      field: "type",
      type: Sequelize.INTEGER,
    },
    idPost: {
      field: "id_post",
      type: Sequelize.INTEGER,
    },
    createdBy: {
      field: "created_by",
      type: Sequelize.INTEGER,
    },
    createdAt: {
      field: "created_at",
      type: Sequelize.DATE,
    },
    isDelete: {
      field: "is_delete",
      type: Sequelize.BOOLEAN,
    },
    updatedBy: {
      field: "updated_by",
      type: Sequelize.INTEGER,
    },
    updatedAt: {
      field: "updated_at",
      type: Sequelize.DATE,
    }
  },
  {
    tableName: "image",
    timestamps: false,
  }
);
export default Image
