import { Req, Res } from '../types';
export const handleCors = (req: Req, res: Res, next: any) => {
    res.header('Access-Control-Allow-Origin', 'http://149.28.45.101');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type,x-requested-with');

    next();
};
