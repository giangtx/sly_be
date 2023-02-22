import express from "express";
import userAdminController from "../../controller/admin/user.controller";
import { verifyToken } from "../../utils/jwtToken";

const router = express.Router();

router.route("/")
  .get(verifyToken(["ADMIN"]), userAdminController.getAll)
  .post(verifyToken(["ADMIN"]), userAdminController.createUser)
  .patch(verifyToken(["ADMIN"]), userAdminController.updateUser);
router.route("/updateDes")
  .patch(verifyToken(["ADMIN"]), userAdminController.updateUserDes);
router.route("/updateStatus")
  .patch(verifyToken(["ADMIN"]), userAdminController.updateUsersStatus);
router.route("/:id")
  .get(verifyToken(["ADMIN"]), userAdminController.getById);
  

export default router;