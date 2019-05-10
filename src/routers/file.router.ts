import { Router } from 'express';
import { Req, Res } from '../types';
import { upload, authenticated } from '../middlewares';
import { batchCustomersService } from '../services/file.service';
import path from 'path';
const fileRouter = Router();

fileRouter.post('/uploadCustomers', authenticated, async (req: Req, res: Res, next: any) => {
    try {
        upload.single('customersFile')(req, res, async err => {
            if (err) {
                next(err);
            } else {
                const { filename, path, mimetype, originalname } = req.file;
                const { key, data } = await batchCustomersService.parseExcelToCustomers(path);
                res.apiSuccess({
                    key,
                    data,
                    filename,
                    originalname,
                });
            }
        });
    } catch (e) {
        next(e);
    }
});

fileRouter.post('/saveUploadedCustomers', authenticated, async (req: Req, res: Res, next: any) => {
    try {
        const { key } = req.body;
        const job_number = req.session.passport.user;
        const result = await batchCustomersService.saveCustomers(key, job_number);
        res.apiSuccess(result);
    } catch (e) {
        next(e);
    }
});

fileRouter.post(
    '/uploadActivityFile',
    upload.single('activityFile'),
    async (req: Req, res: Res, next: any) => {
        try {
            const { path } = req.file;
            res.apiSuccess({
                filePath: path.replace(/\\/g, '/'),
            });
        } catch (e) {
            next(e);
        }
    },
);
export default fileRouter;
