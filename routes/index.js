import express from 'express';
import userRouter from './user';
import authRouter from './auth';
import roleRouter from './role';
import chatRouter from './chat';
import postRouter from './post';
import commentRouter from './comment';
import likeRouter  from './like';
import friendRouter from "./friend";

var router = express.Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/role', roleRouter);
router.use('/chat', chatRouter);
router.use('/post', postRouter);
router.use('/comment', commentRouter);
router.use('/like', likeRouter);
router.use('/friend', friendRouter);

export default router;
