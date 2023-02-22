import catchAsync from "../../utils/catchAsync";
import groupService from "../../service/admin/group.service";

const getAll = catchAsync(async (request, response) => {
  const users = await groupService.getAll(request.query);
  response.json({
    status: 200,
    data: users,
    message: "Success",
  });
});

const createGroup = catchAsync(async (request, response) => {
  const group = await groupService.createGroup(request.body);
  response.json({
    status: 200,
    data: group,
    message: "Success",
  });
});

const addMember = catchAsync(async (request, response) => {
  const group = await groupService.addMember(request.body);
  response.json({
    status: 200,
    data: group,
    message: "Success",
  })
})
const getById = catchAsync( async(request, response) => {
  const group = await groupService.getById(request.params);
  response.json({
    status: 200,
    data: group,
    message: 'update user success'
  })
})

const getMember = catchAsync(async(request, response) => {
  const group = await groupService.getMember(request.body);
  response.json({
    status: 200,
    data: group,
    message: 'update user success'
  })
})

const updateGroup = catchAsync(async(request, response) => {
  console.log('update status')
  const group = await groupService.updateGroup(request.body);
  response.json({
    status: 200,
    data: group,
    message: 'update user success'
  })
})

const updateDes = catchAsync(async(request, response) => {
  console.log('update status')
  const group = await groupService.updateDes(request.body);
  response.json({
    status: 200,
    data: group,
    message: 'update user success'
  })
})

const updateStatus = catchAsync(async(request, response) => {
  console.log('update status')
  const group = await groupService.updateStatus(request.body);
  response.json({
    status: 200,
    data: group,
    message: 'update user success'
  })
})

export default {
  getAll,
  createGroup,
  updateGroup,
  addMember,
  getById,
  getMember,
  updateDes,
  updateStatus,
}