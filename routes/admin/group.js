import express from "express";
import groupAdminController from "../../controller/admin/group.controller";
import { verifyToken } from "../../utils/jwtToken";

const router = express.Router();

router.route("/")
  .get(verifyToken(["ADMIN"]), groupAdminController.getAll)
  .post(verifyToken(["ADMIN"]), groupAdminController.createGroup)
  .patch(verifyToken(["ADMIN"]), groupAdminController.updateGroup);
router.route("/members")
  .get(verifyToken(["ADMIN"]), groupAdminController.getMember)
  .post(verifyToken(["ADMIN"]), groupAdminController.addMember)
router.route("/updateDes")
  .patch(verifyToken(["ADMIN"]), groupAdminController.updateDes);
router.route("/updateStatus")
  .patch(verifyToken(["ADMIN"]), groupAdminController.updateStatus);
router.route("/:id")
  .get(verifyToken(["ADMIN"]), groupAdminController.getById);
  

export default router;