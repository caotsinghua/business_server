import { Req, Res, ResponseJson } from '../types';
export const handleApiResponse = (req: Req, res: Res, next: any) => {
    res.apiSuccess = function(data: any) {
        const resJson: ResponseJson = {
            success: true,
            result: data,
        };
        res.status(200).json(resJson);
    };
    res.apiError = function(error: any) {
        const resJson: ResponseJson = {
            success: false,
            error_code: typeof error.code == 'number' ? error.code : 500,
            error_message: error.message || error.toString(),
        };
        res.status(typeof error.code == 'number' ? error.code : 500).json(resJson);
    };
    next();
};
