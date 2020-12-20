import {
  Post,
  User,
  PostComment,
  PostLike,
  Image,
  Groupuser,
  Friend,
  GroupMember,
} from "../model";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { multipleUpload } from "../utils/multipleUpload";
import Sequelize from "sequelize";
const Op = Sequelize.Op;

const getAll = async ({ size = 10, page = 1 }, createdBy) => {
  const friends = await Friend.findAll({ where: { idUser: createdBy, status: 1 } });
  const list = [];
  const listGroup = [];
  list.push(createdBy);
  await Promise.all(
    friends.map(async (friend) => {
      list.push(friend.friend);
    })
  );
  const groups = await GroupMember.findAll({ where: { idUser: createdBy } });
  await Promise.all(
    groups.map(async (group) => {
      listGroup.push(group.idGroup);
    })
  );
  const posts = await Post.findAndCountAll({
    where: {
      isDelete: false,
      [Op.or]: [
        { createdBy: { [Op.in]: list }, idGroup: null },
        { idGroup: { [Op.in]: listGroup } },
      ],
    },
    limit: parseInt(size),
    offset: size * (page - 1),
    distinct: true,
    order: [["createdAt", "desc"]],
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatar"],
      },
      {
        model: PostComment,
        as: "comment",
        attributes: ["id", "content", "createdAt"],
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
        required: false,
      },
      {
        model: Image,
        attributes: ["id", "name", "url"],
      },
      {
        model: Groupuser,
        attributes: ["id", "name"],
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
const getAllAdmin = async ({ size = 10, page = 1 }, createdBy) => {
  const posts = await Post.findAndCountAll({
    where: {
      isDelete: false,
    },
    limit: parseInt(size),
    offset: size * (page - 1),
    distinct: true,
    order: [["createdAt", "desc"]],
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatar"],
      },
      {
        model: PostComment,
        as: "comment",
        attributes: ["id", "content", "createdAt"],
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
        required: false,
      },
      {
        model: Image,
        attributes: ["id", "name", "url"],
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
        required: false,
      },
      {
        model: Image,
        attributes: ["id", "name", "url"],
      },
    ],
  });
  if (!post) throw new ApiError(httpStatus.NOT_FOUND, "post not exist");
  return post;
};

const createPost = async ({ content, type, idGroup }, createdBy) => {
  const post = await Post.create({
    content,
    type,
    createdBy,
    idGroup: type === 3 ? idGroup : null,
    createdAt: Date.now() + 3600000 * 7,
    isDelete: false,
    likes: 0,
    comment: 0,
  });
  return await getById(createdBy, post.id);
};

const updatePost = async ({ id, content, images }, createdBy) => {
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
        required: false,
      },
      {
        model: Image,
        attributes: ["id", "name", "url"],
      },
    ],
  });
  if (!post) throw new ApiError(httpStatus.NOT_FOUND, "post not found ");
  if (post.user.id !== createdBy)
    throw new ApiError(httpStatus.NOT_FOUND, "only owner can update");
  await post.update({
    content: content ? content : post.content,
    updatedAt: Date.now() + 3600000 * 7,
    updatedBy: createdBy,
  });
  const imgs = await Image.findAll({ where: { idPost: id } });
  const list = [];
  await Promise.all(
    imgs.map(async (img) => {
      list.push(img.id);
    })
  );
  await Promise.all(
    list.map(async (item) => {
      if (!images.includes(item)) {
        await Image.destroy({ where: { id: item } });
      }
    })
  );
  return await Post.findOne({
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
        required: false,
      },
      {
        model: Image,
        attributes: ["id", "name", "url"],
      },
    ],
  });
};

const uploadImagePost = async (request, response) => {
  let { id } = request.jwtDecoded;
  request.des = "./store/image/post";
  await multipleUpload(request, response);
  await Promise.all(
    request.files.map(async (file) => {
      await Image.create({
        name: file.filename,
        url: file.path,
        type: 2,
        createdBy: id,
        isDelete: false,
        createdAt: Date.now() + 3600000 * 7,
        idPost: parseInt(request.params.id),
      });
    })
  );
  return await getById(id, parseInt(request.params.id));
};

const deletePost = async ({ id }) => {
  const post = await Post.findOne({ where: { id } });
  if (!post) throw new ApiError(httpStatus.NOT_FOUND, "comment not found");
  await post.update({
    isDelete: true,
  });
  return post;
};

const getByUsername = async (
  { username },
  { size = 10, page = 1 },
  createdBy
) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "user not exist");
  const posts = await Post.findAndCountAll({
    where: {
      isDelete: false,
      createdBy: user.id,
      idGroup: null,
    },
    limit: parseInt(size),
    offset: size * (page - 1),
    order: [["createdAt", "desc"]],
    distinct: true,
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatar"],
      },
      {
        model: PostComment,
        as: "comment",
        attributes: ["id", "content", "createdAt"],
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
        required: false,
      },
      {
        model: Image,
        attributes: ["id", "name", "url", "type"],
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
const getByGroup = async ({ idGroup }, { size = 10, page = 1 }, createdBy) => {
  const posts = await Post.findAndCountAll({
    where: {
      isDelete: false,
      idGroup,
    },
    limit: parseInt(size),
    offset: size * (page - 1),
    order: [["createdAt", "desc"]],
    distinct: true,
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatar"],
      },
      {
        model: PostComment,
        as: "comment",
        attributes: ["id", "content", "createdAt"],
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
        required: false,
      },
      {
        model: Image,
        attributes: ["id", "name", "url", "type"],
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
export default {
  getAll,
  getById,
  createPost,
  updatePost,
  uploadImagePost,
  deletePost,
  getByUsername,
  getByGroup,
  getAllAdmin,
};
