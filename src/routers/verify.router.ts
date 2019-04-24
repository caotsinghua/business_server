import { Router } from 'express';
import { Req, Res } from '../types';
import { findVerify } from '../services/verify.service';
const verifyRouter = Router();
verifyRouter.get('/:id', async (req: Req, res: Res, next) => {
    try {
        const { id } = req.params;
        const verify = await findVerify(id);
        res.apiSuccess(verify);
    } catch (e) {
        next(e);
    }
});

export default verifyRouter;
