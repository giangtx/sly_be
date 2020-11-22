import Sequelize from "sequelize";
import { sequelize, Op } from "../config/database";

const MemberChat = sequelize.define(
  "member_chat",
  {
    id: {
      field: 'id',
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idChat: {
      field: 'id_chat',
      type: Sequelize.INTEGER,
    },
    idUser: {
      field: 'id_user',
      type: Sequelize.INTEGER,
    },
    role: {
      field: 'role',
      type: Sequelize.INTEGER,
    },
    type: {
      field: 'type',
      type: Sequelize.INTEGER,
    }
  },
  {
    tableName: "member_chat",
    timestamps: false,
  }
);
export default MemberChat;
