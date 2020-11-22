import Sequelize from "sequelize";
import { sequelize, Op } from "../config/database";

const PostLike = sequelize.define(
  "post_like",
  {
    id: {
      field: "id",
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      field: "status",
      type: Sequelize.INTEGER,
    },
    idPost: {
      field: "id_post",
      type: Sequelize.INTEGER,
    },
    createdBy: {
      field: "created_by",
      type: Sequelize.INTEGER,
    }
  },
  {
    tableName: "post_like",
    timestamps: false,
  }
);
export default PostLike;
