import express from "express";
import friendController from "../controller/friend.controller";
import { verifyTokenCookie } from "../utils/jwtToken";

const router = express.Router();

router.route("/").get(friendController.getAll);
router.route("/user").
  get(verifyTokenCookie(), friendController.getFriend);
router.route("/not").
  get(verifyTokenCookie(), friendController.getNotFriend);
router.route("/approval")
  .get(verifyTokenCookie(), friendController.getApproval)
  .post(verifyTokenCookie(), friendController.approvalFriend);
router.route("/add/:id")
  .post(verifyTokenCookie(), friendController.addFriend);

export default router;
