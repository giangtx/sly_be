import { PostComment, User, Post } from "../model";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

const getByPost = async (
  { size = 10, page = 1 }, idPost
) => {
  const comments = await PostComment.findAndCountAll({
    where: { idPost, isDelete: false },
    limit: parseInt(size),
    offset: size * (page - 1),
    distinct: true,
    include: {
      model: User,
      attributes: ["id", "username", "avatar"],
    },
    attributes: ["id", "content", "createdAt",],
    order: [["createdAt", "desc"]],
  })
  return {
    data: comments.rows.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }),
    size,
    length: comments.length,
    currentPage: page,
    totalpage: Math.ceil(comments.count / size),
    totalElements: comments.count,
  };
};

const createComment = async (
  { content, idPost }, createdBy
) => {
  const post = await Post.findOne({ where: { id: idPost }});
  if (!post) throw new ApiError(httpStatus.NOT_FOUND, "post not found");
  const comment = await PostComment.create({
    content,
    idPost,
    createdBy,
    createdAt: Date.now() + 3600000 * 7,
    isDelete: false,
  })
  await post.update({
    comments: post.comments+1
  })
  return PostComment.findOne({
    where: { id: comment.id },
    include: {
      model: User,
      attributes: ["id", "username", "avatar"],
    },
    attributes: ["id", "content", "createdAt",],
    order: [["createdAt", "asc"]],
  })
}

const updateComment = async (
  { id, content }, updatedBy
) => {
  const comment = await PostComment.findOne({
    where: { id },
    include: {
      model: User,
      attributes: ["id", "username", "avatar"],
    },
    attributes: ["id", "content", "createdAt",],
    order: [["createdAt", "asc"]],
  })
  if (!comment) throw new ApiError(httpStatus.NOT_FOUND, "comment not found");
  if (comment.user.id !== updatedBy) throw new ApiError(httpStatus.BAD_REQUEST, "only owner can update")
  await comment.update({
    content,
    updatedBy,
    updatedAt: Date.now() + 3600000 * 7,
  })
  return comment;
}

const deleteComment = async ({ id }) => {
  const comment = await PostComment.findOne({
    where: { id, isDelete: false },
  })
  if (!comment) throw new ApiError(httpStatus.NOT_FOUND, "comment not found");
  const post = await Post.findOne({ where: { id: comment.idPost }});
  await comment.update({
    isDelete: true
  })
  await post.update({
    comments: post.comments > 0 ? post.comments-1 : 0
  })
  return comment;
}

export default {
  getByPost,
  createComment,
  updateComment,
  deleteComment,
};
