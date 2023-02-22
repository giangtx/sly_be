import catchAsync from "../../utils/catchAsync";
import userService from "../../service/admin/user.service";

const getAll = catchAsync(async (request, response) => {
  const users = await userService.getAll(request.query);
  response.json({
    status: 200,
    data: users,
    message: "Success",
  });
});

const createUser = catchAsync(async (request, response) => {
  const users = await userService.createUser(request.body);
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
const updateUser = catchAsync( async(request, response) => {
  const user = await userService.updateUser(request.body);
  response.json({
    status: 200,
    data: user,
    message: 'update user success'
  })
})

const updateUserDes = catchAsync(async(request, response) => {
  const user = await userService.updateUserDes(request.body);
  response.json({
    status: 200,
    data: user,
    message: 'update user success'
  })
})

const updateUsersStatus = catchAsync(async(request, response) => {
  console.log('update status')
  await userService.updateUsersStatus(request.body);
  response.json({
    status: 200,
    message: 'update user success'
  })
})

export default {
  getAll,
  createUser,
  getById,
  updateUser,
  updateUserDes,
  updateUsersStatus
}