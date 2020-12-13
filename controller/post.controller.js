import catchAsync from "../utils/catchAsync";
import postService from "../service/post.service";
const fs = require('fs');

const getAll = catchAsync(async (request, response) => {
  const posts = await postService.getAll(request.query, request.jwtDecoded.id);
  response.json({
    status: "Ok",
    data: posts,
    message: "Success",
  });
});

const getById = catchAsync(async (request, response) => {
  const post = await postService.getById(request.jwtDecoded.id, request.params.id);
  response.json({
    status: 200,
    data: post,
    message: "Success",
  })
})

const createPost = catchAsync(async (request, response) => {
  const post = await postService.createPost(request.body, request.jwtDecoded.id);
  response.json({
    status: 200,
    data: post,
    message: "Success",
  })
})

const updatePost = catchAsync(async (request, response) => {
  const post = await postService.updatePost(request.body, request.jwtDecoded.id);
  response.json({
    status: 200,
    data: post,
    message: "Success",
  })
})

const uploadImagePost = catchAsync(async (request, response) => {
  const post = await postService.uploadImagePost(request, response);
  response.json({
    status: 200,
    data: post,
    message: "Success",
  })
})

const deletePost = catchAsync(async (request, response) => {
  await postService.deletePost(request.params);
  response.json({
    status: 200,
    message: "Success",
  })
})
const getImage = catchAsync(async (request, response) => {
  const { image } = request.params;
  fs.readFile(`./store/image/post/${image}`, (err, data) => {
    response.writeHead(200, { 'Content-Type': 'image/jpeg' });
    response.end(data);
  });
})

const getByUsername = catchAsync(async (request, response) => {
  const posts = await postService.getByUsername(request.params, request.query, request.jwtDecoded ? request.jwtDecoded.id : null);
  response.json({
    status: 200,
    data: posts,
    message: "Success",
  })
})
const getByGroup = catchAsync(async (request, response) => {
  const posts = await postService.getByGroup(request.params, request.query, request.jwtDecoded ? request.jwtDecoded.id : null);
  response.json({
    status: 200,
    data: posts,
    message: "Success",
  })
})

export default {
  getAll,
  getById,
  createPost,
  updatePost,
  uploadImagePost,
  deletePost,
  getImage,
  getByUsername,
  getByGroup
};
