import { Router } from 'express';
import { Req, Res } from '../types';
import { authenticated, aclAuthenticated } from '../middlewares';
import { updateRecordStatus } from '../services/activities.service';

const recordsRouter = Router();

recordsRouter.put('/:recordId', async (req: Req, res: Res, next: any) => {
    try {
        const { success } = req.body;
        const { recordId } = req.params;
        const result = await updateRecordStatus(recordId, success);
        res.apiSuccess(result);
    } catch (e) {
        next(e);
    }
});

export default recordsRouter;
