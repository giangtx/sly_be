import express from "express";
import chatController from "../controller/chat.controller";

const router = express.Router();

router.route("/").get(chatController.getAll);

export default router;
