import { Router } from 'express';
import { Req, Res } from '../types';
import { upload, authenticated } from '../middlewares';
import { getExcelAndParseToCustomers } from '../services/file.service';
import path from 'path';
const fileRouter = Router();

fileRouter.post('/uploadCustomers', authenticated, async (req: Req, res: Res, next: any) => {
    try {
        upload.single('customersFile')(req, res, async err => {
            if (err) {
                next(err);
            } else {
                const job_number = req.session.passport.user;
                const { filename, path, mimetype, originalname } = req.file;
                const result = await getExcelAndParseToCustomers(path);
                res.apiSuccess({
                    data: result,
                    filename,
                    originalname,
                });
            }
        });
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
