import express from "express";
import likeController from "../controller/like.controller";
import { verifyTokenCookie } from "../utils/jwtToken";

const router = express.Router();

router.route("/:id")
  .post(verifyTokenCookie(), likeController.likeHandle);

export default router;
