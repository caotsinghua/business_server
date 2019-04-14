import { Router } from 'express';
import { Req, Res, Global } from '../types';

const aclRouter = Router();
const glob: Global = global;
const acl = glob.acl;

// ===================================>acl权限管理<=================================
/**
 *
 * @api {get} /acl/userRoles/:id getUserRoles
 * @apiName 获取用户拥有的角色
 * @apiGroup acl-controller
 * @apiVersion  0.0.1
 *
 *
 * @apiParam  {number} id userid
 *
 * @apiSuccess (200) {type} name description
 *
 *
 *
 * @apiSuccessExample {type} Success-Response:
 * {
 *      success:true,
 *      result:{
 *          id : value,
 *          roles:[]
 *      }
 *
 * }
 *
 *
 */
aclRouter.get('/userRoles/:id', async (req: Req, res: Res, next: any) => {
    try {
        const { id } = req.params;
        acl.userRoles(id, (err: any, roles: any) => {
            if (err) return next(err);
            res.apiSuccess({
                id,
                roles,
            });
        });
    } catch (e) {
        next(e);
    }
});
/**
 *
 * @api {post} /acl/addUserRoles addUserRoles
 * @apiName 添加用户角色
 * @apiGroup acl-controller
 * @apiVersion  0.0.1
 *
 *
 * @apiParam  {String} id userid
 * @apiParam  {Array} roles roles
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
aclRouter.post('/addUserRoles/:id', async (req: Req, res: Res, next: any) => {
    try {
        const { id } = req.params;
        const { roles } = req.body;
        const result = await acl.addUserRoles(id, roles);
        res.apiSuccess(result);
    } catch (e) {
        next(e);
    }
});
/**
 *
 * @api {post} /acl/removeUserRoles/:id removeUserRoles
 * @apiName 移除用户角色
 * @apiGroup acl-controller
 * @apiVersion  0.0.1
 *
 *
 * @apiParam  {String} id userid
 * @apiParam  {Array} roles roles
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
aclRouter.post('/removeUserRoles/:id', async (req: Req, res: Res, next: any) => {
    try {
        const { id } = req.params;
        const { roles } = req.body;
        const result = await acl.removeUserRoles(id, roles);
        res.apiSuccess(result);
    } catch (e) {
        next(e);
    }
});
export default aclRouter;
