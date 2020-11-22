import { PostLike, Post } from "../model";

const likeHandle = async (
  { id }, createdBy
) => {

  const like = await PostLike.findOne({ where: { idPost: id, createdBy }});
  const post = await Post.findOne({ where: { id }});
  if (!like) {
    await PostLike.create({ 
      idPost: id, createdBy, status: 1
    })
    await post.update({
      likes: post.likes+1
    })
  } else {
    await like.destroy();
    await post.update({
      likes: post.like > 0 ? post.likes-1 : 0
    })
  }
};

export default {
  likeHandle,
};
