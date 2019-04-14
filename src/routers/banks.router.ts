import { Router } from 'express';
import { Req, Res } from '../types';
import { getBank, getBanks, createBank, updateBank } from '../services/bank.service';
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
bankRouter.post('/', async (req: Req, res: Res, next) => {
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
bankRouter.put('/:bankId', async (req: Req, res: Res, next) => {
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
export default bankRouter;
