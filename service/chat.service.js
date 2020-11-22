import { Chat, Message, User, MemberChat } from "../model";

const getAll = async () => {
  return await Chat.findAll({
    where: {},
    include: [
      {
        model: Message,
        attributes: ["id", "message"],
        include: {
          model: User,
          attributes: ["id", "username"],
        },
      },
      {
        model: MemberChat,
        attributes: ["id", "type"],
        include: {
          model: User,
          attributes: ["id", "username"],
        },
      },
    ],
    order: [[Message, "id", "asc"]],
  });
};

export default {
  getAll,
};
