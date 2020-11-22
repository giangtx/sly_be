import catchAsync from "../utils/catchAsync";
import chatService from "../service/chat.service";

const getAll = catchAsync(async (request, response) => {
  const chats = await chatService.getAll();
  response.json({
    status: "Ok",
    data: chats,
    message: "Success",
  });
});

export default {
  getAll,
};
