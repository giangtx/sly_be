import { Friend, User } from "../model";
import ApiError from "../utils/ApiError";
import Sequelize from "sequelize";
const Op = Sequelize.Op;

const getAll = async () => {
  return await Friend.findAll({
    where: {},
    include: [
      {
        model: User,
        as: "ban",
        attributes: ["id", "username", "avatar"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "avatar"],
      },
    ],
  });
};

const getFriend = async (idUser, { size = 10, page = 1 }) => {
  const friends = await Friend.findAndCountAll({
    where: {
      idUser,
      status: 1,
    },
    limit: parseInt(size),
    offset: size * (page - 1),
    distinct: true,
    include: [
      {
        model: User,
        as: "ban",
        attributes: ["id", "username", "avatar", "description"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "avatar", "description"],
      },
    ],
  });
  return {
    data: friends.rows,
    size,
    length: friends.length,
    currentPage: page,
    totalpage: Math.ceil(friends.count / size),
    totalElements: friends.count,
  };
};

const getNotFriend = async (idUser, { size = 10, page = 1 }) => {
  const friends = await Friend.findAll({ where: { idUser } });
  const list = [];
  list.push(idUser);
  await Promise.all(
    friends.map(async (friend) => {
      list.push(friend.friend);
    })
  );
  const users = await User.findAndCountAll({
    where: {
      id: { [Op.notIn]: list },
      status: 1,
    },
    limit: parseInt(size),
    offset: size * (page - 1),
    distinct: true,
    attributes: [
      "id",
      "username",
      "email",
      "firstname",
      "lastname",
      "avatar",
      "phone",
      "status",
      "birthday",
      "gender",
      "description",
    ],
  });
  return {
    data: users.rows,
    size,
    length: users.length,
    currentPage: page,
    totalpage: Math.ceil(users.count / size),
    totalElements: users.count,
  };
};
const getApproval = async (idUser, { size = 10, page = 1 }) => {
  const friends = await Friend.findAndCountAll({
    where: {
      idUser,
      status: 3,
    },
    limit: parseInt(size),
    offset: size * (page - 1),
    distinct: true,
    include: [
      {
        model: User,
        as: "ban",
        attributes: ["id", "username", "avatar", "description"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "avatar", "description"],
      },
    ],
  });
  return {
    data: friends.rows,
    size,
    length: friends.length,
    currentPage: page,
    totalpage: Math.ceil(friends.count / size),
    totalElements: friends.count,
  };
};
const addFriend = async (idUser, friend) => {
  const check = await Friend.findOne({ where: { idUser, friend } });
  if (check) throw new ApiError(500, "is friend");
  await Friend.create({
    idUser,
    friend,
    status: 2,
    createdAt: Date.now() + 3600000 * 7,
  });
  await Friend.create({
    idUser: friend,
    friend: idUser,
    status: 3,
    createdAt: Date.now() + 3600000 * 7,
  });
};
const approvalFriend = async (idUser, { friend, isApproval }) => {
  const check = await Friend.findOne({ where: { idUser, friend, status: 1 } });
  if (check) throw new ApiError(500, "is friend");
  const user = await Friend.findOne({ where: { idUser, friend } });
  const userfriend = await Friend.findOne({
    where: { idUser: friend, friend: idUser },
  });
  if (isApproval) {
    await user.update({ status: 1, updatedAt: Date.now() + 3600000 * 7 });
    await userfriend.update({ status: 1, updatedAt: Date.now() + 3600000 * 7 });
  } else {
    await user.destroy();
    await userfriend.destroy();
  }
};
export default {
  getAll,
  getFriend,
  getNotFriend,
  getApproval,
  addFriend,
  approvalFriend,
};
