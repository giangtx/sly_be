import catchAsync from "../utils/catchAsync";
import commentService from "../service/comment.service";

const getByPost = catchAsync(async (request, response) => {
  const comments = await commentService.getByPost(request.query, request.params.id);
  response.json({
    status: "Ok",
    data: comments,
    message: "Success",
  });
});

const createComment = catchAsync(async (request, response) => {
  const comment = await commentService.createComment(request.body, request.jwtDecoded.id);
  response.json({
    status: "Ok",
    data: comment,
    message: "Success",
  });
})

const updateComment = catchAsync(async (request, response) => {
  const comment = await commentService.updateComment(request.body, request.jwtDecoded.id);
  response.json({
    status: "Ok",
    data: comment,
    message: "Success",
  });
})

const deleteComment = catchAsync(async (request, response) => {
  await commentService.deleteComment(request.params);
  response.json({
    status: "Ok",
    message: "Success",
  });
})

export default {
  getByPost,
  createComment,
  updateComment,
  deleteComment
};
