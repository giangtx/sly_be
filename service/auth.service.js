import httpStatus from "http-status";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError";
import { User, Role } from "../model";
import { generateToken } from "../utils/jwtToken";
import * as mailer from "../utils/mailer";

export const login = async ({ username, password }) => {
  const user = await User.findOne({
    where: { username },
    include: [
      {
        model: Role,
        attributes: ["id", "roleName"],
      },
    ],
  });
  if (!user) {
    throw new ApiError(404, "user not exist");
  } else if (!bcrypt.compareSync(password, user.password)) {
    throw new ApiError(401, "Incorrect password!");
  } else if (user.status === 0) {
    throw new ApiError(500, "Not active!");
  }
  const roles = [];
  user.roles.forEach((role) => {
    roles.push(role.roleName);
  });
  const token = generateToken({
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    status: user.status,
    role: roles,
  });
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
      role: roles,
    },
    token,
  };
};

export const register = async ({
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
  const newUser = await User.create({
    username,
    password: passwordHash,
    email,
    firstname,
    lastname,
    status: 0,
    verifyCode: code,
    createdAt: Date.now() + 3600000 * 7,
    updatedAt: Date.now() + 3600000 * 7,
    avatar: "blank.jpg"
  });
  await newUser.addRole(3);
  mailer.sendMail(
    email,
    "Thông báo đăng ký tài khoản",
    `<h2>Chúc mừng bạn đăng ký tài khoản thành công!<h2/><p style="font-weight:500;">Mã xác nhận của bạn là: <span style="font-weight:600;">${code}</span></p>`
  );
  return newUser;
};
export const resendCode = async ({ email }) => {
  const user = await User.findOne({ where: { email }});
  if(!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "email not exist");
  }
  const code = Math.floor(Math.random() * (1000000 - 100000)) + 100000;
  await user.update({
    verifyCode: code,
  })
  mailer.sendMail(
    email,
    "Thông báo tài khoản",
    `<h2>Bạn đã đổi mã xác nhận!<h2/><p style="font-weight:500;">Mã xác nhận của bạn là: <span style="font-weight:600;">${code}</span></p>`
  );
  return {
    status: 200,
    message: 'Thành công',
  };
};
