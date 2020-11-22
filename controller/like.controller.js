import catchAsync from "../utils/catchAsync";
import likeService from "../service/like.service";

const likeHandle = catchAsync(async (request, response) => {
  await likeService.likeHandle(request.params, request.jwtDecoded.id);
  response.json({
    status: "Ok",
    message: "Success",
  });
});

export default {
  likeHandle,
};
