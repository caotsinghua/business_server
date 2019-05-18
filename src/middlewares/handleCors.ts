import { Req, Res } from '../types';
const build_env = process.env.BUILD_ENV;

export const handleCors = (req: Req, res: Res, next: any) => {
    res.header(
        'Access-Control-Allow-Origin',
        build_env === 'development' ? 'http://localhost:8000' : 'http://business.tssword.xin',
    );
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type,x-requested-with');

    next();
};
