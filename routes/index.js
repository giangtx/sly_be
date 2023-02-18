import express from 'express';
import userRouter from './user';
import authRouter from './auth';
import roleRouter from './role';
import chatRouter from './chat';
import postRouter from './post';
import commentRouter from './comment';
import likeRouter  from './like';
import friendRouter from "./friend";
import messageRouter from "./message";
import groupRouter from "./group";
import adminRouter from './admin';

var router = express.Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/role', roleRouter);
router.use('/chat', chatRouter);
router.use('/post', postRouter);
router.use('/comment', commentRouter);
router.use('/like', likeRouter);
router.use('/friend', friendRouter);
router.use('/message', messageRouter);
router.use('/group', groupRouter);
router.use('/admin', adminRouter);

export default router;
