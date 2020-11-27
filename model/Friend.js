import Sequelize from "sequelize";
import { sequelize, Op } from "../config/database";
import User from "./User";

const Friend = sequelize.define(
  "friend",
  {
    id: {
      field: "id",
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUser: {
      field: "id_user",
      type: Sequelize.INTEGER,
    },
    friend: {
      field: "friend",
      type: Sequelize.INTEGER,
    },
    // status = 1 là bạn bè
    // status = 2 đang chờ đồng ý
    // status = 3 chưa đồng ý
    status: {
      field: "status",
      type: Sequelize.INTEGER,
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
    tableName: "friend",
    timestamps: false,
  }
);

export default Friend;
