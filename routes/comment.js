import express from "express";
import commentController from "../controller/comment.controller";
import { verifyTokenCookie } from "../utils/jwtToken";

const router = express.Router();
router.route("/")
  .post(verifyTokenCookie(), commentController.createComment)
  .put(verifyTokenCookie(), commentController.updateComment);
router.route("/delete/:id")
  .post(verifyTokenCookie(), commentController.deleteComment);
router.route("/post/:id").get(commentController.getByPost);

export default router;
