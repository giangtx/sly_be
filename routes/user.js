import express from "express";
import userController from "../controller/user.controller";
import { verifyTokenCookie } from "../utils/jwtToken";

const router = express.Router();

// router.route("/").get(verifyTokenCookie(["USER", "ADMIN"]), userController.getAll);
router.route("/").get(userController.getAll);
router.route("/name/:username").get(userController.getByUsername);
router.route("/update").put(verifyTokenCookie(), userController.updateUser);
router.route("/avatar").put(verifyTokenCookie(), userController.changeAvatar);
router
  .route("/cover")
  .put(verifyTokenCookie(), userController.changeCoverImage);
router.route("/image/:image").get(userController.getImage);
router.route("/listImage/:username").get(userController.getImageByUsername);
router.route("/verify").post(userController.verifyAccount);
router.route("/find").get(userController.findUser);
router.route("/info").get(verifyTokenCookie(), userController.getInfo);
router
  .route("/block")
  .get(verifyTokenCookie(), userController.getAllBlock);
router
  .route("/block/:id")
  .post(verifyTokenCookie(["ADMIN"]), userController.blockUser);
router
  .route("/unblock/:id")
  .post(verifyTokenCookie(["ADMIN"]), userController.unblockUser);
router.route("/:id").get(userController.getById);

export default router;
