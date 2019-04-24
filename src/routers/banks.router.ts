import { Router } from 'express';
import { Req, Res } from '../types';
import {
    getBank,
    getBanks,
    createBank,
    updateBank,
    getUserBanks,
    createSubBank,
    searchBank,
    addStaffToBankWithJob,
    deleteStaffFromBankWithJob,
    getBankStaffsWithJob,
} from '../services/bank.service';
import { authenticated, aclAuthenticated } from '../middlewares';
const bankRouter = Router();
/**
 *
 * @api {get} /banks getBanks
 * @apiName getBanks
 * @apiGroup banks
 * @apiVersion  0.0.1
 *
 *
 * @apiParam  {String} paramName description
 *
 * @apiSuccess (200) {type} name description
 *
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 *
 *
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 *
 *
 */
bankRouter.get('/', async (req: Req, res: Res, next) => {
    try {
        const banks = await getBanks();
        res.apiSuccess(banks);
    } catch (e) {
        next(e);
    }
});

/**
 *
 * @api {post} /banks createBank
 * @apiName createBank
 * @apiGroup banks
 * @apiVersion  0.0.1
 *
 *
 * @apiParam  {String} paramName description
 *
 * @apiSuccess (200) {type} name description
 *
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 *
 *
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 *
 *
 */
bankRouter.post('/', authenticated, aclAuthenticated, async (req: Req, res: Res, next) => {
    try {
        const bank = await createBank(req.body);
        res.apiSuccess(bank);
    } catch (e) {
        next(e);
    }
});

/**
 *
 * @api {put} /banks/:bankId updateBank
 * @apiName updateBank
 * @apiGroup banks
 * @apiVersion  0.0.1
 *
 *
 * @apiParam  {String} paramName description
 *
 * @apiSuccess (200) {type} name description
 *
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 *
 *
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 *
 *
 */
bankRouter.put('/:bankId', authenticated, aclAuthenticated, async (req: Req, res: Res, next) => {
    try {
        const { bankId } = req.params;
        const bank = await updateBank(bankId, req.body);
        res.apiSuccess(bank);
    } catch (e) {
        next(e);
    }
});
/**
 *
 * @api {get} /banks/search searchBAnk
 * @apiName searchBAnk
 * @apiGroup bank
 * @apiVersion  0.0.1
 *
 *
 * @apiParam  {String} paramName description
 *
 * @apiSuccess (200) {type} name description
 *
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 *
 *
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 *
 *
 */
bankRouter.get('/search', async (req: Req, res: Res, next: any) => {
    try {
        const { searchWord } = req.query;
        const banks = await searchBank(searchWord);
        res.apiSuccess(banks);
    } catch (e) {
        next(e);
    }
});
/**
 *
 * @api {get} /banks/staffsWithJob getstaffsWithJob
 * @apiName getstaffsWithJob
 * @apiGroup banks
 * @apiVersion  0.0.1
 *
 *
 * @apiParam  {String} paramName description
 *
 * @apiSuccess (200) {type} name description
 *
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 *
 *
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 *
 *
 */
bankRouter.get('/staffsWithJob', async (req: Req, res: Res, next: any) => {
    try {
        const { bankId, jobId } = req.query;
        const staffs = await getBankStaffsWithJob(bankId, jobId);
        res.apiSuccess(staffs);
    } catch (e) {
        next(e);
    }
});

/**
 *
 * @api {get} /banks/:bankId getBank
 * @apiName getBank
 * @apiGroup banks
 * @apiVersion  0.0.1
 *
 *
 * @apiParam  {String} paramName description
 *
 * @apiSuccess (200) {type} name description
 *
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 *
 *
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 *
 *
 */
bankRouter.get('/:bankId', async (req: Req, res: Res, next) => {
    try {
        const { bankId } = req.params;
        const bank = await getBank(bankId);
        res.apiSuccess(bank);
    } catch (e) {
        next(e);
    }
});

bankRouter.get('/userBanks', authenticated, async (req: Req, res: Res, next: any) => {
    try {
        const job_number = req.session.passport.user;
        const bank = await getUserBanks(job_number);
        res.apiSuccess(bank);
    } catch (e) {
        next(e);
    }
});
// 创建支行
bankRouter.post(
    '/userBanks',
    authenticated,
    aclAuthenticated,
    async (req: Req, res: Res, next: any) => {
        try {
            const job_number = req.session.passport.user;
            const bank = await createSubBank(job_number, req.body);
            res.apiSuccess(bank);
        } catch (e) {
            next(e);
        }
    },
);
// 添加用户到指定岗位
bankRouter.post(
    '/staffToJob',
    authenticated,
    aclAuthenticated,
    async (req: Req, res: Res, next: any) => {
        try {
            await addStaffToBankWithJob(req.body);
            res.apiSuccess({ message: '添加成功' });
        } catch (e) {
            next(e);
        }
    },
);

// 删除用户岗位
bankRouter.delete(
    '/staffFromJob/:userId',
    authenticated,
    aclAuthenticated,
    async (req: Req, res: Res, next: any) => {
        try {
            const { userId } = req.params;
            await deleteStaffFromBankWithJob(userId);
            res.apiSuccess({ message: '删除成功' });
        } catch (e) {
            next(e);
        }
    },
);
export default bankRouter;
