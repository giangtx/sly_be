import { User, Role } from "../../model";
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
      { username: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
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
  const users = await User.findAndCountAll({
    where,
    include: [
      {
        model: Role,
        attributes: ["id", "roleName"],
      },
    ],
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
    results: users.rows,
    size,
    length: users.length,
    currentPage: page,
    totalpage: Math.ceil(users.count / size),
    totalElements: users.count,
  };
};

const createUser = async ({
  username,
  password,
  email,
  firstname,
  lastname,
}) => {
  if (await User.findOne({ where: { username } })) {
    throw new ApiError(401, "username already taken");
  }
  if (await User.findOne({ where: { email } })) {
    throw new ApiError(402, "email already taken");
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const code = Math.floor(Math.random() * (1000000 - 100000)) + 100000;
  const user = await User.create({
    username,
    password: passwordHash,
    email,
    firstname,
    lastname,
    status: 1,
    verifyCode: code,
    createdAt: Date.now() + 3600000 * 7,
    updatedAt: Date.now() + 3600000 * 7,
    avatar: "blank.jpg"
  });
  await user.addRole(3);
  return user;
}

const getById = async ({ id }) => {
  const user = await User.findOne({
    where: { id, isDelete: false },
    include: [
      {
        model: Role,
        attributes: ["id", "roleName"],
      },
    ],
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
    ],
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not exist");
  }
  return user;
};

const updateUser = async (
  { id, firstname, lastname, birthday, phone, gender, address, description }
) => {
  const user = await User.findOne({
    where: { id },
    include: [
      {
        model: Role,
        attributes: ["id", "roleName"],
      },
    ],
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
      "coverImage",
      "address",
    ],
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  await user.update({
    firstname: firstname ? firstname : user.firstname,
    lastname: lastname ? lastname : user.lastname,
    birthday: birthday ? birthday : user.birthday,
    phone: phone ? phone : user.phone,
    gender: gender ? gender : user.gender,
    address: address ? address : user.address,
    description: description ? description : user.description,
    updatedAt: Date.now() + 3600000 * 7,
  });
  return user;
};

const updateUserDes = async ({ id, description }) => {
  const user = await User.findOne({
    where: { id },
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
      "coverImage",
      "address",
    ],
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  await user.update({
    description: description ? description : user.description,
    updatedAt: Date.now() + 3600000 * 7,
  });
  return user;
}

const updateUsersStatus = async ({ ids, status }) => {
  await User.update({ status }, {where: { id: ids} });
};

export default {
  getAll,
  createUser,
  getById,
  updateUser,
  updateUserDes,
  updateUsersStatus,
}