import { Router } from 'express';
import { Req, Res } from '../types';
import { getVisitData, getSalesData } from '../mock/chart';
const chartRouter = Router();

// console.log(mockchart);
chartRouter.get('/', async (req: Req, res: Res, next: any) => {
    try {
        res.apiSuccess({
            visitData: getVisitData(),
            salesData: getSalesData(),
        });
    } catch (e) {
        next(e);
    }
});

export default chartRouter;
