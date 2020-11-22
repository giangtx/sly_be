import express from "express";
import postController from "../controller/post.controller";
import { verifyTokenCookie } from "../utils/jwtToken";

const router = express.Router();

router.route("/")
  .get(verifyTokenCookie(), postController.getAll)
  .post(verifyTokenCookie(), postController.createPost)
  .put(verifyTokenCookie(), postController.updatePost);
router.route("/upload/:id")
  .post(verifyTokenCookie(), postController.uploadImagePost);
router.route("/delete/:id")
  .post(verifyTokenCookie(), postController.deletePost);
router.route("/image/:image")
  .get(postController.getImage);
router.route("/user/:username")
  .get(postController.getByUsername);
router.route("/:id")
  .get(verifyTokenCookie(), postController.getById);

export default router;
