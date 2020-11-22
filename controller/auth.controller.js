import catchAsync from "../utils/catchAsync";
import * as authService from "../service/auth.service";

export const login = catchAsync(async (request, response) => {
  const user = await authService.login(request.body);
  response.cookie("JWT", user.token, {
    maxAge: 86400000,
    httpOnly: true,
  });
  response.json({
    tokenType: "Bearer",
    user: user.user,
    token: user.token,
  });
});
export const register = catchAsync(async (request, response) => {
  await authService.register(request.body);
  response.json({
    status: 200,
    message: "register success! Please check gmail",
  });
});

export const resendCode = catchAsync(async (request, response) => {
  await authService.resendCode(request.body)
  response.json({
    status: 200,
    message: "resend code success! Please check gmail",
  });
})

export const logout = catchAsync(async (request, response) => {
  response.clearCookie('JWT');
  response.json({
    status: 200,
    message: "logout success",
  });
})

export const testCookie = catchAsync(async (request, response) => {
  response.cookie("JWTwwt", "something something", {
    maxAge: 86400000,
    httpOnly: true,
  });
  response.json({
    tokenType: "Bearer",
  });
});