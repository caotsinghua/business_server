import { Req, Res, Global } from '../types';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

const glob: Global = global;
const acl = glob.acl;
// 权限管理中间件
export const aclAuthenticated = async (req: Req, res: Res, next: any) => {
    const userRepository = getRepository(User);
    let resource = req.baseUrl;
    if (req.route) {
        resource = resource + req.route.path;
    }
    // 容错 如果访问的是 /admin/sign/ 后面为 /符号认定也为过
    if (resource[resource.length - 1] === '/') {
        resource = resource.slice(0, -1);
    }
    console.log({ resource });
    try {
        const job_number = req.session.passport.user;
        const user = await userRepository.findOne({ job_number });
        let isRoot = await acl.hasRole(user.id, 'root');
        // root 权限直接跳过
        if (isRoot) {
            return next();
        }
        const isAllowed = await acl.isAllowed(user.id, resource, req.method.toLowerCase());
        console.log({ isAllowed });
        if (!isAllowed) {
            res.apiError({
                message: '权限不够',
                code: 403,
            });
        } else {
            req.userInfo = user;
            return next();
        }
    } catch (e) {
        next(e);
    }
};
