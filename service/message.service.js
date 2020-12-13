import { Message, User } from "../model";

const getMessageByChat = async (idChat, { size = 10, page = 1 }) => {
  const messages = await Message.findAndCountAll({
    where: {
      idChat,
    },
    include: {
      model: User,
      attributes: ["id", "username", "avatar"],
    },
    limit: parseInt(size),
    offset: size * (page - 1),
    distinct: true,
    attributes: ["id", "message", "createdAt"],
    order: [["createdAt", "desc"]],
  });
  return {
    data: messages.rows.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }),
    size,
    length: messages.length,
    currentPage: page,
    totalpage: Math.ceil(messages.count / size),
    totalElements: messages.count,
  };
};

const createMessage = async ({ username, message, idChat }) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new ApiError(404, "user not exist");
  const newMessage = await Message.create({
    message,
    sender: user.id,
    isDelete: false,
    idChat,
    createdAt: Date.now() + 3600000 * 7,
  });
  return await Message.findOne({
    where: { id: newMessage.id },
    include: {
      model: User,
      attributes: ["id", "username", "avatar"],
    },
  });
};
export default {
  getMessageByChat,
  createMessage,
};
