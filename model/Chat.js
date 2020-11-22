import Sequelize from "sequelize";
import { sequelize, Op } from "../config/database";

const Chat = sequelize.define(
  "chat",
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
    image: {
      field: "image",
      type: Sequelize.STRING,
    },
    type: {
      field: "type",
      type: Sequelize.INTEGER,
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
    },
  },
  {
    tableName: "chat",
    timestamps: false,
  }
);
export default Chat;
