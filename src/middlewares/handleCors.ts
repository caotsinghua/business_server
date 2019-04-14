import { Req, Res } from '../types';
export const handleCors = (req: Req, res: Res, next: any) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:9528');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};
