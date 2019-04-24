import { Router } from 'express';
import { Req, Res } from '../types';
import {
    getUserNotices,
    sendNotice,
    readOneNotice,
    readAllNotices,
} from '../services/notices.service';
import { authenticated } from '../middlewares';
const noticesRouter = Router();

noticesRouter.post('/', authenticated, async (req: Req, res: Res, next: any) => {
    try {
        const job_number = req.session.passport.user;
        const { title, content, toId } = req.body;
        const response = await sendNotice(job_number, toId, { title, content });
        res.apiSuccess(response);
    } catch (e) {
        next(e);
    }
});

noticesRouter.get('/', authenticated, async (req: Req, res: Res, next: any) => {
    try {
        const job_number = req.session.passport.user;
        const notices = await getUserNotices(job_number);
        res.apiSuccess(notices);
    } catch (e) {
        next(e);
    }
});

noticesRouter.post('/readOne/:noticeId', authenticated, async (req: Req, res: Res, next: any) => {
    try {
        const { noticeId } = req.params;
        const response = await readOneNotice(noticeId);
        res.apiSuccess(response);
    } catch (e) {
        next(e);
    }
});

noticesRouter.post('/readAll', authenticated, async (req: Req, res: Res, next: any) => {
    try {
        const job_number = req.session.passport.user;
        const response = await readAllNotices(job_number);
        res.apiSuccess(response);
    } catch (e) {
        next(e);
    }
});

export default noticesRouter;
