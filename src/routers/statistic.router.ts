import { Router } from 'express';
import { Req, Res } from '../types';
import {
    getActivityCustomers,
    getActivityStatistic,
    setTarget,
    contactCustomer,
    customerJoinActivity,
} from '../services/statistic.service';
const statisticRouter = Router();

statisticRouter.get('/:activityId', async (req: Req, res: Res, next: any) => {
    try {
        const { activityId } = req.params;
        const [customers, statistic] = await Promise.all([
            getActivityCustomers(activityId),
            getActivityStatistic(activityId),
        ]);
        res.apiSuccess({
            customers,
            statistic,
        });
    } catch (e) {
        next(e);
    }
});

statisticRouter.post('/setTarget/:activityId', async (req: Req, res: Res, next: any) => {
    try {
        const { activityId } = req.params;
        const response = await setTarget(activityId, req.body);
        res.apiSuccess(response);
    } catch (e) {
        next(e);
    }
});

statisticRouter.post('/contactCustomer', async (req: Req, res: Res, next: any) => {
    try {
        const { customerId, activityId } = req.body;
        const response = await contactCustomer(customerId, activityId);
        res.apiSuccess(response);
    } catch (e) {
        next(e);
    }
});

statisticRouter.post('/contactCustomer', async (req: Req, res: Res, next: any) => {
    try {
        const { customerId, activityId } = req.body;
        const response = await contactCustomer(customerId, activityId);
        res.apiSuccess(response);
    } catch (e) {
        next(e);
    }
});

statisticRouter.post('/joinActivity', async (req: Req, res: Res, next: any) => {
    try {
        const { customerId, activityId, money } = req.body;
        const response = await customerJoinActivity(customerId, activityId, money);
        res.apiSuccess(response);
    } catch (e) {
        next(e);
    }
});
export default statisticRouter;
