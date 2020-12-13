import { Groupuser, GroupMember, User, Image } from "../model";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import Sequelize from "sequelize";
import { singleUpload } from "../utils/multipleUpload";
const Op = Sequelize.Op;

const getAll = async ({ size = 10, page = 1, search = "" }) => {
  let where = {
    isDelete: false,
  };
  if (search !== "") {
    where = {
      isDelete: false,
      name: { [Op.like]: `%${search}%` },
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
        attributes: ["id", "username", "avatar"],
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
const getMemberJoin = async ({ id }, { size = 10, page = 1, search = "" }) => {
  let whereUser = {};
  if (search !== "") {
    whereUser = {
      username: { [Op.like]: `%${search}%` },
    };
  }
  const members = await GroupMember.findAndCountAll({
    where: { idGroup: id, status: 2 },
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatar"],
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
const createGroup = async (createdBy, { name, description }) => {
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
};

const updateGroup = async (updatedBy, { id, name, description }) => {
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
    updatedBy,
    updatedAt: Date.now() + 3600000 * 7,
  });
  return group;
};
const changeAvatar = async (request, response) => {
  let { id } = request.params;
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
  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  request.des = "./store/image/user";
  await singleUpload(request, response);
  await group.update({
    avatar: request.file ? request.file.filename : group.avatar,
  });
  await Image.create({
    name: request.file.filename,
    url: request.file.path,
    type: 1,
    createdBy: request.jwtDecoded.id,
    createdAt: Date.now() + 3600000 * 7,
    isDelete: false,
  });
  return group;
};

const joinGroup = async (idUser, idGroup) => {
  const check = await GroupMember.findOne({ where: { idUser, idGroup } });
  if (check) throw new ApiError(500, "user exist");
  const member = await GroupMember.create({
    idUser,
    idGroup,
    role: 2,
    status: 2,
  });
  return member;
};
const approvalGroup = async ({ idUser, idGroup, isApproval }) => {
  const check = await GroupMember.findOne({ where: { idUser, idGroup } });
  if (!check) throw new ApiError(404, "user not found");
  if (isApproval) {
    await check.update({ status: 1 });
  } else {
    await check.destroy();
  }
};
const getUserGroup = async (idUser, { size = 10, page = 1, search = "" }) => {
  const userGroup = await GroupMember.findAll({ where: { idUser, status: 1 } });
  const list = [];
  await Promise.all(
    userGroup.map(async (member) => {
      list.push(member.idGroup);
    })
  );
  let where = {
    isDelete: false,
    id: { [Op.in]: list },
  };
  if (search !== "") {
    where = {
      isDelete: false,
      id: { [Op.in]: list },
      name: { [Op.like]: `%${search}%` },
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
const getOtherGroup = async (idUser, { size = 10, page = 1, search = "" }) => {
  const userGroup = await GroupMember.findAll({ where: { idUser } });
  const list = [];
  await Promise.all(
    userGroup.map(async (member) => {
      list.push(member.idGroup);
    })
  );
  let where = {
    isDelete: false,
    id: { [Op.notIn]: list },
  };
  if (search !== "") {
    where = {
      isDelete: false,
      id: { [Op.notIn]: list },
      name: { [Op.like]: `%${search}%` },
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
export default {
  getAll,
  getById,
  getMember,
  createGroup,
  updateGroup,
  changeAvatar,
  joinGroup,
  approvalGroup,
  getMemberJoin,
  getUserGroup,
  getOtherGroup,
};
