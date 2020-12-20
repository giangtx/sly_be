import { User, Role, Image, Friend } from "../model";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { singleUpload } from "../utils/multipleUpload";
import Sequelize from "sequelize";
const Op = Sequelize.Op;

const getAll = async ({ size = 10, page = 1, search = "" }) => {
  let where = {
    isDelete: false,
    status: 1,
  };
  if (search !== "") {
    where = {
      isDelete: false,
      status: 1,
      [Op.or]: [
        { username: { [Op.like]: `%${search}%` } },
      ],
    };
  }
  const users = await User.findAndCountAll({
    where,
    include: [
      {
        model: Role,
        attributes: ["id", "roleName"],
      },
      {
        model: Friend,
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
    data: users.rows,
    size,
    length: users.length,
    currentPage: page,
    totalpage: Math.ceil(users.count / size),
    totalElements: users.count,
  };
};

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
const getByUsername = async ({ username }) => {
  const user = await User.findOne({
    where: { username, isDelete: false },
    include: [
      {
        model: Role,
        attributes: ["id", "roleName"],
      },
      {
        model: Friend,
        limit: 12,
        offset: 0,
        distinct: true,
        include: [
          {
            model: User,
            as: "ban",
            attributes: ["id", "username", "avatar", "description"],
          },
        ],
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
    throw new ApiError(httpStatus.NOT_FOUND, "user not exist");
  }
  return user;
};
const updateUser = async (
  id,
  { firstname, lastname, birthday, phone, gender, address, description }
) => {
  const user = await User.findOne({
    where: { id },
    include: [
      {
        model: Role,
        attributes: ["id", "roleName"],
      },
      {
        model: Friend,
        limit: 12,
        offset: 0,
        distinct: true,
        include: [
          {
            model: User,
            as: "ban",
            attributes: ["id", "username", "avatar", "description"],
          },
        ],
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

const changeAvatar = async (request, response) => {
  let { id } = request.jwtDecoded;
  const user = await User.findOne({
    where: { id },
    include: [
      {
        model: Role,
        attributes: ["id", "roleName"],
      },
      {
        model: Friend,
        limit: 12,
        offset: 0,
        distinct: true,
        include: [
          {
            model: User,
            as: "ban",
            attributes: ["id", "username", "avatar", "description"],
          },
        ],
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
  request.des = "./store/image/user";
  await singleUpload(request, response);
  await user.update({
    avatar: request.file ? request.file.filename : user.avatar,
  });
  await Image.create({
    name: request.file.filename,
    url: request.file.path,
    type: 1,
    createdBy: id,
    createdAt: Date.now() + 3600000 * 7,
    isDelete: false,
  });
  return user;
};

const changeCoverImage = async (request, response) => {
  let { id } = request.jwtDecoded;
  const user = await User.findOne({
    where: { id },
    include: [
      {
        model: Role,
        attributes: ["id", "roleName"],
      },
      {
        model: Friend,
        limit: 12,
        offset: 0,
        distinct: true,
        include: [
          {
            model: User,
            as: "ban",
            attributes: ["id", "username", "avatar", "description"],
          },
        ],
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
  request.des = "./store/image/user";
  await singleUpload(request, response);
  await user.update({
    coverImage: request.file ? request.file.filename : user.coverImage,
  });
  await Image.create({
    name: request.file.filename,
    url: request.file.path,
    type: 1,
    createdBy: id,
    createdAt: Date.now() + 3600000 * 7,
    isDelete: false,
  });
  return user;
};

const verifyAccount = async ({ verifyCode, email }) => {
  const user = await User.findOne({
    where: { email },
  });
  if (!user) throw new ApiError(404, "Email not exist");
  if (user.status !== 0)
    throw new ApiError(405, "Email already active");
  if (user.verifyCode !== verifyCode)
    throw new ApiError(500, "Incorrect code");
  await user.update({
    status: 1,
    updatedAt: Date.now() + 3600000 * 7,
  });
};

const findUser = async ({ size = 10, page = 1, search = "" }) => {
  let where = {
    isDelete: false,
  };
  if (search !== "") {
    where = {
      isDelete: false,
      // $or: [
      //   { userName: { $regex: search, $options: 'i' } },
      //   { email: { $regex: search, $options: 'i' } },
      //   { phoneNumber: { $regex: search, $options: 'i' } },
      // ],
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

const getInfo = async (id) => {
  return await User.findOne({
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
      "description",
    ],
  });
};

const getImageByUsername = async ({ username }) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "user not exist");
  const images = await Image.findAll({
    where: { createdBy: user.id, isDelete: false },
    limit: 9,
  });
  return images;
};
const blockUser = async (id) => {
  const user = await User.findOne({
    where: { id },
    include: [
      {
        model: Role,
        attributes: ["id", "roleName"],
      },
      {
        model: Friend,
        limit: 12,
        offset: 0,
        distinct: true,
        include: [
          {
            model: User,
            as: "ban",
            attributes: ["id", "username", "avatar", "description"],
          },
        ],
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
    status: 3,
  });
  return user;
}
const unblockUser = async (id) => {
  const user = await User.findOne({
    where: { id },
    include: [
      {
        model: Role,
        attributes: ["id", "roleName"],
      },
      {
        model: Friend,
        limit: 12,
        offset: 0,
        distinct: true,
        include: [
          {
            model: User,
            as: "ban",
            attributes: ["id", "username", "avatar", "description"],
          },
        ],
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
    status: 1,
  });
  return user;
}
const getAllBlock = async ({ size = 10, page = 1, search = "" }) => {
  let where = {
    isDelete: false,
    status: 3,
  };
  if (search !== "") {
    where = {
      isDelete: false,
      status: 3,
      [Op.or]: [
        { username: { [Op.like]: `%${search}%` } },
      ],
    };
  }
  const users = await User.findAndCountAll({
    where,
    include: [
      {
        model: Role,
        attributes: ["id", "roleName"],
      },
      {
        model: Friend,
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
    data: users.rows,
    size,
    length: users.length,
    currentPage: page,
    totalpage: Math.ceil(users.count / size),
    totalElements: users.count,
  };
};
export default {
  getAll,
  getById,
  getByUsername,
  updateUser,
  changeAvatar,
  verifyAccount,
  findUser,
  getInfo,
  getImageByUsername,
  changeCoverImage,
  blockUser,
  unblockUser,
  getAllBlock,
};
