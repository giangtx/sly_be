import express from 'express';
import userController from '../controller/user.controller';

const router = express.Router();

router.route('/')
    .get(userController.getAll)

export default router;
