import express from 'express';
import userRouter from './user';
import groupRouter from './group';

const router = express.Router();

router.use('/users', userRouter);
router.use('/groups', groupRouter);

export default router;