import { Req, Res } from '../types';
export const handleCors = (req: Req, res: Res, next: any) => {
    // res.header('Access-Control-Allow-Origin', 'http://business.tssword.xin');
    res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type,x-requested-with');

    next();
};
