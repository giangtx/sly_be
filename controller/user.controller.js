import catchAsync from "../utils/catchAsync";
const fs = require('fs');
import userService from "../service/user.service";

const getAll = catchAsync(async (request, response) => {
  const users = await userService.getAll(request.query);
  response.json({
    status: 200,
    data: users,
    message: "Success",
  });
});

const getById = catchAsync(async (request, response) => {
  const user = await userService.getById(request.params);
  response.json({
    status: 200,
    data: user,
    message: "Success",
  })
})

const getByUsername = catchAsync(async (request, response) => {
  const user = await userService.getByUsername(request.params);
  response.json({
    status: 200,
    data: user,
    message: "Success",
  })
})
const updateUser = catchAsync( async(request, response) => {
  const user = await userService.updateUser(request.jwtDecoded.id, request.body)
  response.json({
      status: 200,
      data: user,
      message: 'update user success'
  })
})
const changeAvatar = catchAsync( async(request, response) => {
  const user = await userService.changeAvatar(request, response);
  response.json({
    status: 200,
    data: user,
    message: 'change avatar success'
  })
})

const getImage = catchAsync(async (request, response) => {
  const { image } = request.params;
  fs.readFile(`./store/image/user/${image}`, (err, data) => {
    response.writeHead(200, { 'Content-Type': 'image/jpeg' });
    response.end(data);
  });
})

const verifyAccount = catchAsync(async (request, response) => {
  await userService.verifyAccount(request.body);
  response.json({
    status: 200,
    message: "active success",
  });
})

const findUser = catchAsync(async (request, response) => {
  const user = await userService.findUser(request.query);
  response.json({
    status: 200,
    data: user,
    message: "active success",
  });
})

const getInfo = catchAsync(async (request, response) => {
  const user = await userService.getInfo(request.jwtDecoded.id);
  response.json({
    status: 200,
    data: user,
    message: "success",
  });
})

const getImageByUsername = catchAsync(async (request, response) => {
  const images = await userService.getImageByUsername(request.params);
  response.json({
    status: 200,
    data: images,
    message: "success",
  })
})

export default {
  getAll,
  getById,
  getByUsername,
  updateUser,
  changeAvatar,
  getImage,
  verifyAccount,
  findUser,
  getInfo,
  getImageByUsername
};
