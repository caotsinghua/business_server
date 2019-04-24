import { Router } from 'express';
import { Req, Res } from '../types';
import { authenticated, aclAuthenticated } from '../middlewares';
import {
    createActivity,
    patchActivityStatus,
    patchVerifyStatus,
    bindManager,
    bindVerifyer,
    getActivity,
    getActivities,
    updateActivity,
} from '../services/activities.service';

const activitiesRouter = Router();
activitiesRouter.post(
    '/',
    authenticated,
    aclAuthenticated,
    async (req: Req, res: Res, next: any) => {
        try {
            const job_number = req.session.passport.user;
            const activity = await createActivity(job_number, req.body);
            res.apiSuccess(activity);
        } catch (e) {
            next(e);
        }
    },
);

activitiesRouter.get('/', async (req: Req, res: Res, next: any) => {
    try {
        const response = await getActivities(req.query.page, req.query.pageSize);
        res.apiSuccess(response);
    } catch (e) {
        next(e);
    }
});

activitiesRouter.get('/:activityId', async (req: Req, res: Res, next: any) => {
    try {
        const activity = await getActivity(req.params.activityId);
        res.apiSuccess(activity);
    } catch (e) {
        next(e);
    }
});

activitiesRouter.patch('/:activityId/verifyStatus', async (req: Req, res: Res, next: any) => {
    try {
        const { status, nopass_reason } = req.body;
        await patchVerifyStatus(req.params.activityId, status, nopass_reason);
        res.apiSuccess();
    } catch (e) {
        next(e);
    }
});

activitiesRouter.patch('/:activityId/status', async (req: Req, res: Res, next: any) => {
    try {
        const { activityId } = req.params;
        const { status } = req.body;
        await patchActivityStatus(activityId, status);
        res.apiSuccess();
    } catch (e) {
        next(e);
    }
});

activitiesRouter.patch('/:activityId/bindManager', async (req: Req, res: Res, next: any) => {
    try {
        const { activityId } = req.params;
        const { managerId } = req.body;
        await bindManager(managerId, activityId);
        res.apiSuccess();
    } catch (e) {
        next(e);
    }
});
activitiesRouter.patch('/:activityId/bindVerifyer', async (req: Req, res: Res, next: any) => {
    try {
        const { activityId } = req.params;
        const { verifyerId } = req.body;
        await bindVerifyer(verifyerId, activityId);
        res.apiSuccess();
    } catch (e) {
        next(e);
    }
});

activitiesRouter.put('/:activityId', async (req: Req, res: Res, next: any) => {
    try {
        const { activityId } = req.params;
        const response = await updateActivity(activityId, req.body);
        res.apiSuccess(response);
    } catch (e) {
        next(e);
    }
});
export default activitiesRouter;
