import { Router } from 'express';
import { Req, Res } from '../types';
import { createModelAndGroup, getGroups, findData } from '../services/groupModel.service';
import { authenticated, aclAuthenticated } from '../middlewares';

const groupModelRouter = Router();

groupModelRouter.post('/', authenticated, aclAuthenticated, async (req: Req, res: Res, next) => {
    try {
        const job_number = req.session.passport.user;
        const response = await createModelAndGroup(job_number, req.body);
        res.apiSuccess(response);
    } catch (e) {
        console.log(e);
        next(e);
    }
});
groupModelRouter.get('/test', async (req: Req, res: Res, next: any) => {
    try {
        const groups = await findData();
        res.apiSuccess(groups);
    } catch (e) {
        next(e);
    }
});
groupModelRouter.get('/', async (req: Req, res: Res, next: any) => {
    try {
        const groups = await getGroups();
        res.apiSuccess(groups);
    } catch (e) {
        next(e);
    }
});
export default groupModelRouter;
