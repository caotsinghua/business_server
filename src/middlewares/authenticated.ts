import { Req, Res } from '../types';
export const authenticated = (req: Req, res: Res, next: any) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.apiError({ message: '未登录', code: 401 });
    }
};
