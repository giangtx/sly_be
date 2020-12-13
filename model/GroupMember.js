import Sequelize from "sequelize";
import { sequelize, Op } from "../config/database";

const GroupMember = sequelize.define(
  "group_member",
  {
    id: {
      field: 'id',
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idGroup: {
      field: 'id_group',
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
    // 1 = member, 2 = chờ phê duyệt
    status: {
      field: "status",
      type: Sequelize.INTEGER,
    }
  },
  {
    tableName: "group_member",
    timestamps: false,
  }
);
export default GroupMember;
