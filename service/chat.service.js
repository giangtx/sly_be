import { Chat, Message, User, MemberChat } from "../model";
import Sequelize from "sequelize";
const Op = Sequelize.Op;

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

const getChatByUser = async (idUser, { size = 10, page = 1 }) => {
  const members = await MemberChat.findAll({ where: { idUser } });
  const list = [];
  await Promise.all(
    members.map(async (member) => {
      list.push(member.idChat);
    })
  );
  const chats = await Chat.findAndCountAll({
    where: {
      id: { [Op.in]: list },
    },
    include: [
      {
        model: MemberChat,
        attributes: ["id", "type"],
        include: {
          model: User,
          attributes: ["id", "username", "avatar"],
        },
        where: {
          idUser: { [Op.ne]: idUser },
        },
      },
    ],
    limit: parseInt(size),
    offset: size * (page - 1),
    distinct: true,
    attributes: ["id", "name", "image", "type", "createdAt"],
  });
  return {
    data: chats.rows,
    size,
    length: chats.length,
    currentPage: page,
    totalpage: Math.ceil(chats.count / size),
    totalElements: chats.count,
  };
};

export default {
  getAll,
  getChatByUser,
};
