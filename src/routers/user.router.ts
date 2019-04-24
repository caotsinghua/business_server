import { Router } from 'express';
import { Req, Res } from '../types';
import {
    login,
    register,
    getUserInfo,
    updateUserInfo,
    updateUserPassword,
    searchUser,
    searchVerifyers,
    searchManagers,
} from '../services/auth.service';
import { authenticated } from '../middlewares';
const userRouter = Router();

/**
 *
 * @api {post} /user/login login
 * @apiName login
 * @apiGroup user
 * @apiVersion  0.0.1
 */
userRouter.post('/login', (req: Req, res: Res, next: any) => {
    try {
        login(req, res, next);
    } catch (e) {
        next(e);
    }
});
/**
 *
 * @api {post} /user/register register
 * @apiName register
 * @apiGroup user
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
userRouter.post('/register', async (req: Req, res: Res, next: any) => {
    try {
        await register(req, res);
    } catch (e) {
        next(e);
    }
});
/**
 *
 * @api {get} /user/info getUserInfo
 * @apiName getUserInfo
 * @apiGroup user
 * @apiVersion  0.0.1
 *
 *
 *
 *
 */
userRouter.get('/info', authenticated, async (req: Req, res: Res, next: any) => {
    try {
        const job_number = req.session.passport.user;
        const info = await getUserInfo(job_number);
        res.apiSuccess(info);
    } catch (e) {
        next(e);
    }
});

/**
 *
 * @api {put} /user/info updateUserInfo
 * @apiName updateUserInfo
 * @apiGroup user
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
userRouter.put('/info', authenticated, async (req: Req, res: Res, next: any) => {
    try {
        const job_number = req.session.passport.user;
        const info = await updateUserInfo(job_number, req.body);
        res.apiSuccess(info);
    } catch (e) {
        next(e);
    }
});
/**
 *
 * @api {patch} /user/password patchPassword
 * @apiName patchPassword
 * @apiGroup user
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
userRouter.patch('/password', authenticated, async (req: Req, res: Res, next: any) => {
    try {
        const job_number = req.session.passport.user;
        const { new_password, old_password } = req.body;
        const info = await updateUserPassword(job_number, { new_password, old_password });
        res.apiSuccess(info);
    } catch (e) {
        next(e);
    }
});
/**
 *
 * @api {get} /user/search searchUser
 * @apiName searchUser
 * @apiGroup user
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
userRouter.get('/search', async (req: Req, res: Res, next: any) => {
    try {
        const users = await searchUser(req, res);
        res.apiSuccess(users);
    } catch (e) {
        next(e);
    }
});

userRouter.get('/searchVerifyer', async (req: Req, res: Res, next: any) => {
    try {
        const { searchWord } = req.query;
        const users = await searchVerifyers(searchWord);
        res.apiSuccess(users);
    } catch (e) {
        next(e);
    }
});

userRouter.get('/searchManagers', async (req: Req, res: Res, next: any) => {
    try {
        const { searchWord } = req.query;
        const managers = await searchManagers(searchWord);
        res.apiSuccess(managers);
    } catch (e) {
        next(e);
    }
});
export default userRouter;
