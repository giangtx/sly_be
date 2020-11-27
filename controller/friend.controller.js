import catchAsync from "../utils/catchAsync";
import friendService from "../service/friend.service";

const getAll = catchAsync(async (request, response) => {
  const friends = await friendService.getAll();
  response.json({
    status: "Ok",
    data: friends,
    message: "Success",
  });
});

const getFriend = catchAsync(async (request, response) => {
  const friends = await friendService.getFriend(
    request.jwtDecoded.id,
    request.query
  );
  response.json({
    status: "Ok",
    data: friends,
    message: "Success",
  });
});

const getNotFriend = catchAsync(async (request, response) => {
  const users = await friendService.getNotFriend(request.jwtDecoded.id, request.query);
  response.json({
    status: "Ok",
    data: users,
    message: "Success",
  });
})

const getApproval = catchAsync(async (request, response) => {
  const users = await friendService.getApproval(request.jwtDecoded.id, request.query);
  response.json({
    status: "Ok",
    data: users,
    message: "Success",
  });
})
export default {
  getAll,
  getFriend,
  getNotFriend,
  getApproval
};
