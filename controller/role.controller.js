import catchAsync from "../utils/catchAsync";
import roleService from "../service/role.service";

const getAll = catchAsync(async (request, response) => {
  const roles = await roleService.getAll();
  response.json({
    status: "Ok",
    data: roles,
    message: "Success",
  });
});

export default {
  getAll,
};
