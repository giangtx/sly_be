import express from "express";
import userController from "../controller/user.controller";
import { verifyTokenCookie } from "../utils/jwtToken";

const router = express.Router();

// router.route("/").get(verifyTokenCookie(["USER", "ADMIN"]), userController.getAll);
router.route("/")
  .get(userController.getAll);
router.route("/name/:username")
  .get(userController.getByUsername);
router.route("/update")
  .put(verifyTokenCookie(), userController.updateUser);
router.route("/avatar")
  .put(verifyTokenCookie(), userController.changeAvatar);
router.route("/image/:image")
  .get(userController.getImage);
router.route("/listImage/:username")
  .get(userController.getImageByUsername);
router.route("/verify")
  .post(userController.verifyAccount);
router.route("/find")
  .get(userController.findUser);
router.route("/info")
  .get(verifyTokenCookie(), userController.getInfo);
router.route("/:id")
  .get(userController.getById);

export default router;
