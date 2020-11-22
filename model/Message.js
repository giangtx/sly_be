import Sequelize from "sequelize";
import { sequelize, Op } from "../config/database";

const Message = sequelize.define(
  "message",
  {
    id: {
      field: "id",
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      field: "message",
      type: Sequelize.STRING,
    },
    sender: {
      field: "sender",
      type: Sequelize.INTEGER,
    },
    idChat: {
      field: "id_chat",
      type: Sequelize.INTEGER,
    },
    image: {
      field: "image",
      type: Sequelize.STRING,
    },
    isDelete: {
      field: "is_delete",
      type: Sequelize.BOOLEAN,
    },
    createdAt: {
      field: "created_at",
      type: Sequelize.DATE,
    },
    updatedAt: {
      field: "updated_at",
      type: Sequelize.DATE,
    }
  },
  {
    tableName: "message",
    timestamps: false,
  }
);
export default Message;
