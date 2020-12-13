import express from "express";
import messageController from "../controller/message.controller";
import { verifyTokenCookie } from "../utils/jwtToken";

const router = express.Router();

router.route("/").post(verifyTokenCookie(), messageController.createMessage);
router.route("/chat/:id").get(verifyTokenCookie(), messageController.getMessageByChat);

export default router;