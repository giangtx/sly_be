import { Post, User, PostComment, PostLike, Image } from "../model";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { multipleUpload } from '../utils/multipleUpload';

const getAll = async ({ size = 10, page = 1 }, createdBy) => {
  const posts = await Post.findAndCountAll({
    where: {
      isDelete: false
    },
    limit: parseInt(size),
    offset: size * (page - 1),
    distinct: true,
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatar"],
      },
      {
        model: PostComment,
        as: "comment",
        attributes: ["id", "content", "createdAt",],
        include: {
          model: User,
          attributes: ["id", "username", "avatar"],
        },
      },
      {
        model: PostLike,
        attributes: ["id", "status"],
        as: "like",
        where: { createdBy },
        required: false
      },
      {
        model: Image,
        attributes: ["id", "name", "url", "path"],
      },
    ],
  });
  return {
    data: posts.rows,
    size,
    length: posts.length,
    currentPage: page,
    totalpage: Math.ceil(posts.count / size),
    totalElements: posts.count,
  };
};

const getById = async (createdBy, id) => {
  const post = await Post.findOne({
    where: { id, isDelete: false },
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatar"],
      },
      {
        model: PostComment,
        as: "comment",
        attributes: ["id", "content"],
        include: {
          model: User,
          attributes: ["id", "username", "avatar"],
        },
      },
      {
        model: PostLike,
        attributes: ["id", "status"],
        as: "like",
        where: { createdBy },
        required: false
      },
      {
        model: Image,
        attributes: ["id", "name", "url", "path"],
      },
    ],
  });
  if (!post) throw new ApiError(httpStatus.NOT_FOUND, "post not exist");
  return post;
}

const createPost = async ({
  content, type, idGroup
}, createdBy) => {
  const post = await Post.create({
    content,
    type,
    createdBy,
    idGroup: type !==1 ? idGroup : null,
    createdAt: Date.now(),
    isDelete: false,
    likes: 0,
    comment: 0,
  })
  return await getById(createdBy, post.id);
}

const updatePost = async ({
  id, content
}, createdBy) => {
  const post = await Post.findOne({ 
    where: { id },
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatar"],
      },
      {
        model: PostComment,
        as: "comment",
        attributes: ["id", "content"],
        include: {
          model: User,
          attributes: ["id", "username", "avatar"],
        },
      },
      {
        model: PostLike,
        attributes: ["id", "status"],
        as: "like",
        where: { createdBy },
        required: false
      },
      {
        model: Image,
        attributes: ["id", "name", "url", "path"],
      },
    ]
  })
  if (!post) throw new ApiError(httpStatus.NOT_FOUND, "post not found ");
  if (post.user.id !== createdBy) throw new ApiError(httpStatus.NOT_FOUND, "only owner can update");
  await post.update({
    content: content ? content : post.content,
    updatedAt: Date.now(),
    updatedBy: createdBy
  })
  return post;
}
const uploadImagePost = async (request, response) => {
  let { id } = request.jwtDecoded;
  request.des = './store/image/post';
  await multipleUpload(request, response);
  await Promise.all(
    request.files.map(async (file) => {
      await Image.create({
        name: file.filename,
        url: file.path,
        type: 2,
        createdBy: id,
        isDelete: false,
        createdAt: Date.now(),
        idPost: parseInt(request.params.id)
      })
    })
  );
  return await getById(id, parseInt(request.params.id));
}

const deletePost = async ({ id }) => {
  const post = await Post.findOne({ where: { id }});
  if (!post) throw new ApiError(httpStatus.NOT_FOUND, "comment not found");
  await post.update({
    isDelete: true
  })
  return post;
}

const getByUsername = async ({ username }, { size = 10, page = 1 }, createdBy) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "user not exist");
  const posts = await Post.findAndCountAll({
    where: {
      isDelete: false,
      createdBy: user.id
    },
    limit: parseInt(size),
    offset: size * (page - 1),
    distinct: true,
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatar"],
      },
      {
        model: PostComment,
        as: "comment",
        attributes: ["id", "content", "createdAt",],
        include: {
          model: User,
          attributes: ["id", "username", "avatar"],
        },
      },
      {
        model: PostLike,
        attributes: ["id", "status"],
        as: "like",
        where: { createdBy },
        required: false
      },
      {
        model: Image,
        attributes: ["id", "name", "url", "path"],
      },
    ],
  });
  return {
    data: posts.rows,
    size,
    length: posts.length,
    currentPage: page,
    totalpage: Math.ceil(posts.count / size),
    totalElements: posts.count,
  };
}

export default {
  getAll,
  getById,
  createPost,
  updatePost,
  uploadImagePost,
  deletePost,
  getByUsername,
};
