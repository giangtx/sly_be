import catchAsync from "../utils/catchAsync";
import messageService from "../service/message.service";

const getMessageByChat = catchAsync(async (request, response) => {
  const chats = await messageService.getMessageByChat(
    request.params.id,
    request.query
  );
  response.json({
    status: 200,
    data: chats,
    message: "Success",
  });
});

const createMessage = catchAsync(async (request, response) => {
  const chat = await messageService.createMessage(
    request.body,
  );
  response.json({
    status: 200,
    data: chat,
    message: "Success",
  });
})

export default {
  getMessageByChat,
  createMessage
}
