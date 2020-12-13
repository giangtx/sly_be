import express from "express";
import chatController from "../controller/chat.controller";
import { verifyTokenCookie } from "../utils/jwtToken";

const router = express.Router();

router.route("/").get(chatController.getAll);
router.route("/user").get(verifyTokenCookie(), chatController.getChatByUser);

export default router;
