import catchAsync from "../utils/catchAsync";
import groupService from "../service/group.service";

const getAll = catchAsync(async (request, response) => {
  const groups = await groupService.getAll(request.query);
  response.json({
    status: 200,
    data: groups,
    message: "Success",
  });
});
const getById = catchAsync(async (request, response) => {
  const group = await groupService.getById(request.params);
  response.json({
    status: 200,
    data: group,
    message: "Success",
  });
})
const getMember = catchAsync(async (request, response) => {
  const members = await groupService.getMember(request.params, request.query);
  response.json({
    status: 200,
    data: members,
    message: "Success",
  });
})
const getMemberJoin = catchAsync(async (request, response) => {
  const members = await groupService.getMemberJoin(request.params, request.query);
  response.json({
    status: 200,
    data: members,
    message: "Success",
  });
})
const createGroup = catchAsync( async (request, response) => {
  const group = await groupService.createGroup(request.jwtDecoded.id, request.body);
  response.json({
    status: 200,
    data: group,
    message: "Success",
  });
})
const updateGroup = catchAsync( async (request, response) => {
  const group = await groupService.updateGroup(request.jwtDecoded.id, request.body);
  response.json({
    status: 200,
    data: group,
    message: "Success",
  });
})
const changeAvatar = catchAsync( async(request, response) => {
  const user = await groupService.changeAvatar(request, response);
  response.json({
    status: 200,
    data: user,
    message: 'success'
  })
})
const joinGroup = catchAsync( async (request, response) => {
  const members = await groupService.joinGroup(request.jwtDecoded.id, request.params.id)
  response.json({
    status: 200,
    data: members,
    message: 'success'
  })
})
const approvalGroup = catchAsync( async (request, response) => {
  await groupService.approvalGroup(request.body);
  response.json({
    status: 200,
    message: 'success'
  })
})
const getUserGroup = catchAsync( async (request, response) => {
  const groups = await groupService.getUserGroup(request.jwtDecoded.id, request.query);
  response.json({
    status: 200,
    data: groups,
    message: "Success",
  });
})
const getOtherGroup = catchAsync( async (request, response) => {
  const groups = await groupService.getOtherGroup(request.jwtDecoded.id, request.query);
  response.json({
    status: 200,
    data: groups,
    message: "Success",
  });
})
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
