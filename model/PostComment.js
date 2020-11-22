import Sequelize from "sequelize";
import { sequelize, Op } from "../config/database";

const PostComment = sequelize.define(
  "post_comment",
  {
    id: {
      field: "id",
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      field: "content",
      type: Sequelize.STRING,
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
    },
  },
  {
    tableName: "post_comment",
    timestamps: false,
  }
);
export default PostComment;
