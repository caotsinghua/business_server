import multer from 'multer';
import path from 'path';
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'files/upload/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});
export const upload = multer({
    storage,
});

export * from './aclAuthenticated';
export * from './handleCors';
export * from './handleError';
export * from './handleRes';
export * from './authenticated';
