import { Groupuser } from "../../model";
import ApiError from "../../utils/ApiError";
import httpStatus from "http-status";
import Sequelize from "sequelize";
import bcrypt from "bcrypt";
const Op = Sequelize.Op;


const getAll = async ({ size = 10, page = 1, search = "", status = null, startDate = '', endDate = '' }) => {
  let where = {
    isDelete: false,
  };
  if (search !== "") {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
    ]
  }
  if (status) {
    where.status = status;
  }
  if (startDate && endDate) {
    where.created_at = {
      [Op.between]: [startDate, endDate],
    };
  } else if (startDate) {
    where.created_at = {
      [Op.gte]: startDate,
    };
  } else if (endDate) {
    where.created_at = {
      [Op.lte]: endDate,
    };
  }
  const groups = await Groupuser.findAndCountAll({
    where,
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatar"],
      },
    ],
    limit: parseInt(size),
    offset: size * (page - 1),
    distinct: true,
    attributes: [
      "id",
      "name",
      "description",
      "status",
      "avatar",
      "coverImage",
      "createdAt",
    ],
  });
  return {
    data: groups.rows,
    size,
    length: groups.length,
    currentPage: page,
    totalpage: Math.ceil(groups.count / size),
    totalElements: groups.count,
  };
};

const createGroup = async ({
  createdBy, name, description
}) => {
  const group = await Groupuser.create({
    name,
    description,
    status: 1,
    avatar: "blank.jpg",
    createdBy,
    isDelete: false,
    createdAt: Date.now() + 3600000 * 7,
  });
  await GroupMember.create({
    idGroup: group.id,
    idUser: createdBy,
    role: 1,
    status: 1,
  });
  return group;
}

const addMember = async ({
  groupId, userId, role
}) => {
  await GroupMember.create({
    idGroup: groupId,
    idUser: userId,
    role: 1,
    status: role,
  });
}

const getById = async ({ id }) => {
  const group = await Groupuser.findOne({
    where: { id, isDelete: false },
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatar"],
      },
    ],
    attributes: [
      "id",
      "name",
      "description",
      "status",
      "avatar",
      "coverImage",
      "createdAt",
    ],
  });
  if (!group) throw new ApiError(404, "not found");
  return group;
};

const getMember = async ({ id }, { size = 10, page = 1, search = "" }) => {
  let whereUser = {};
  if (search !== "") {
    whereUser = {
      username: { [Op.like]: `%${search}%` },
    };
  }
  const members = await GroupMember.findAndCountAll({
    where: { idGroup: id, status: 1 },
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatar", "description"],
        where: whereUser,
      },
    ],
    limit: parseInt(size),
    offset: size * (page - 1),
    distinct: true,
    attributes: ["id", "role", "status"],
  });
  return {
    data: members.rows,
    size,
    length: members.length,
    currentPage: page,
    totalpage: Math.ceil(members.count / size),
    totalElements: members.count,
  };
};

const updateGroup = async ({ id, name, description }) => {
  const group = await Groupuser.findOne({
    where: { id },
    attributes: [
      "id",
      "name",
      "description",
      "status",
      "avatar",
      "coverImage",
      "createdAt",
      "createdBy",
    ],
  });
  if (!group) throw new ApiError(404, "group not found");
  await group.update({
    name,
    description,
    updatedAt: Date.now() + 3600000 * 7,
  });
  return group;
};

const updateDes = async ({ id, description }) => {
  const group = await Groupuser.findOne({
    where: { id },
    attributes: [
      "id",
      "name",
      "description",
      "status",
      "avatar",
      "coverImage",
      "createdAt",
      "createdBy",
    ],
  });
  if (!group) throw new ApiError(404, "group not found");
  await group.update({
    description,
    updatedAt: Date.now() + 3600000 * 7,
  });
  return group;
}

const updateStatus = async ({ ids, status }) => {
  await Groupuser.update({ status }, {where: { id: ids} });
};

export default {
  getAll,
  createGroup,
  addMember,
  getById,
  getMember,
  updateGroup,
  updateDes,
  updateStatus,
}