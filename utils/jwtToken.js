import jwt from "jsonwebtoken";

const { secretKey } = process.env;

export const generateToken = (user) => {
  // const data = {
  //   id: user.id,
  //   username: user.username,
  //   role: user.roleId,
  //   email: user.email,
  // };
  return jwt.sign({ data: user }, secretKey, { expiresIn: 168 * 60 * 60 });
};

export const verifyToken = (roles) => (request, response, next) => {
  if (typeof request.headers.authorization !== "undefined") {
    let token = request.headers.authorization.split(" ")[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return response.status(401).json({
          status: 401,
          message: "Incorrect token",
        });
        // throw new Error("Incorrect token");
      }
      if (roles && !checkCommon(roles, user.data.role)) {
        return response.status(403).json({
          status: 403,
          message: "access denied",
        });
      }
      request.jwtDecoded = user.data;
      return next();
    });
  } else {
    return response.status(401).json({
      status: 401,
      message: "Missing token",
    });
    // throw new Error("Missing token");
  }
};

export const verifyTokenCookie = (roles) => (request, response, next) => {
  if (typeof request.headers.cookie !== "undefined") {
    let rawCookie = request.headers.cookie.split("; ");
    let rawJWT = "";
    rawCookie.forEach((test) => {
      if (test.split("=")[0] === "JWT") {
        rawJWT = test.split("=")[1];
      }
    });
    jwt.verify(rawJWT, secretKey, (err, user) => {
      if (err) {
        return response.status(401).json({ error: "Invalid token cookie" });
      }
      if (roles && !checkCommon(roles, user.data.role)) {
        return response.status(403).json({
          status: 403,
          message: "access denied",
        });
      }
      request.jwtDecoded = user.data;
      // console.log(request)
      return next();
    });
  } else {
    return response.status(401).json({
      status: 401,
      message: "Missing token",
    });
  }
};
const checkCommon = (arr1, arr2) => { 
  return arr1.some(item => arr2.includes(item)) 
} 
