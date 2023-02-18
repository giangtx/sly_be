import express from "express";
import userAdminController from "../../controller/admin/user.controller";
import { verifyToken } from "../../utils/jwtToken";

const router = express.Router();

router.route("/")
  .get(verifyToken(["ADMIN"]), userAdminController.getAll)
  .post(verifyToken(["ADMIN"]), userAdminController.createUser);
router.route("/:id")
  .get(verifyToken(["ADMIN"]),userAdminController.getById)
  .patch(verifyToken(["ADMIN"]),userAdminController.updateUser);

export default router;