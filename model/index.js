import User from "./User";
import Role from "./Role";
import UserRole from "./UserRole";
import Chat from "./Chat";
import MemberChat from "./MemberChat";
import Message from "./Message";
import Post from "./Post";
import PostComment from "./PostComment";
import PostLike from "./PostLike";
import Image from "./Image";
import Friend from "./Friend";

User.belongsToMany(Role, { through: UserRole, foreignKey: "id_user" });
User.hasMany(MemberChat, { foreignKey: "id_user" });
User.hasMany(Post, { foreignKey: "created_by" });
User.hasMany(Friend, { foreignKey: "id_user" });

Role.belongsToMany(User, { through: UserRole, foreignKey: "id_role" });

Chat.hasMany(Message, { foreignKey: "id_chat" });
Chat.hasMany(MemberChat, { foreignKey: "id_chat" });

Message.belongsTo(Chat, { foreignKey: "id_chat" });
Message.belongsTo(User, { foreignKey: "sender" });

MemberChat.belongsTo(Chat, { foreignKey: "id_chat" });
MemberChat.belongsTo(User, { foreignKey: "id_user" });

Post.belongsTo(User, { foreignKey: "created_by" });
Post.hasMany(PostComment, { as: "comment", foreignKey: "id_post" });
Post.hasMany(PostLike, { as: "like", foreignKey: "id_post" });
Post.hasMany(Image, { foreignKey: "id_post" });

PostComment.belongsTo(User, { foreignKey: "created_by" });
PostComment.belongsTo(Post, { foreignKey: "id_post" });

PostLike.belongsTo(User, { foreignKey: "created_by" });
PostLike.belongsTo(Post, { foreignKey: "id_post" });

Image.belongsTo(Post, { foreignKey: "id_post" });

Friend.belongsTo(User, { as: "ban", foreignKey: "friend" })
Friend.belongsTo(User, { as: "user", foreignKey: "id_user" })

export { User, Role, Chat, MemberChat, Message, Post, PostLike, PostComment, Image, Friend };
