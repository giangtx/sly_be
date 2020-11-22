import express from "express";
import roleController from "../controller/role.controller";

const router = express.Router();

router.route("/").get(roleController.getAll);

export default router;
