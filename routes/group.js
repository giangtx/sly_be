import express from "express";
import groupController from "../controller/group.controller";
import { verifyTokenCookie } from "../utils/jwtToken";

const router = express.Router();

router.route("/")
  .get(groupController.getAll)
  .post(verifyTokenCookie(), groupController.createGroup)
  .put(verifyTokenCookie(), groupController.updateGroup);
router.route("/member/:id")
  .get(verifyTokenCookie(), groupController.getMember);
router.route("/join/:id")
  .get(verifyTokenCookie(), groupController.getMemberJoin)
  .post(verifyTokenCookie(), groupController.joinGroup);
router.route("/approval")
  .post(verifyTokenCookie(), groupController.approvalGroup);
router.route("/avatar/:id")
  .put(verifyTokenCookie(), groupController.changeAvatar);
router.route("/user")
  .get(verifyTokenCookie(), groupController.getUserGroup);
router.route("/other")
  .get(verifyTokenCookie(), groupController.getOtherGroup);

router.route("/:id")
  .get(groupController.getById)

export default router;