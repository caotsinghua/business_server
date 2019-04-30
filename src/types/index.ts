import { Request, Response } from 'express';
export interface Res extends Response {
    apiSuccess?: Function;
    apiError?: Function;
    [propName: string]: any;
}
export interface Req extends Request {
    [propName: string]: any;
}
export interface ResponseJson {
    success: boolean;
    result?: any;
    error_code?: any;
    error_message?: any;
}
export interface Global extends NodeJS.Global {
    acl?: any;
    upload?: any;
}
