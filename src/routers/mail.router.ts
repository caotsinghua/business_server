import { Router } from 'express';
import { Req, Res } from '../types';
import { sendEmail } from '../services/mail.service';
const mailRouter = Router();

mailRouter.post('/', async (req: Req, res: Res, next: any) => {
    try {
        const result = sendEmail(req.body);
        res.apiSuccess(result);
    } catch (e) {
        next(e);
    }
});

export default mailRouter;
