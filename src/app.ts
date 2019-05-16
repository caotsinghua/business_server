import express from 'express';
import bodyparser from 'body-parser';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import passport from './services/passport.service';
import aclConfig from './config/acl.config';
import session from 'express-session';
import Acl from 'acl';
import { Global } from './types';
import { handleApiResponse, handleError, handleCors, authenticated } from './middlewares';

import aclRouter from './routers/acl.router';
import userRouter from './routers/user.router';
import banksRouter from './routers/banks.router';
import customersRouter from './routers/customers.router';
import groupModelRouter from './routers/groupModel.router';
import activitiesRouter from './routers/activities.router';
import verifyRouter from './routers/verify.router';
import noticesRouter from './routers/notices.router';
import statisticRouter from './routers/statistic.router';
import fileRouter from './routers/file.router';
import recordsRouter from './routers/records.router';
import mailRouter from './routers/mail.router';
import chartRouter from './routers/chart.router';
const app = express();

const acl = new Acl(new Acl.memoryBackend());

acl.allow(aclConfig);
acl.addUserRoles(1, 'root');
const glob: Global = global;
glob.acl = acl;

app.set('port', process.env.PORT || 4000);
app.use(handleApiResponse);
app.use(handleCors);
app.use(
    session({
        secret: 'business.secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000, //单位：毫秒
            httpOnly: false,
        },
    }),
);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/files', express.static('files'));
app.use('/acl', authenticated, aclRouter);
app.use('/user', userRouter);
app.use('/banks', banksRouter);
app.use('/customers', customersRouter);
app.use('/groupModels', groupModelRouter);
app.use('/activities', activitiesRouter);
app.use('/verifies', verifyRouter);
app.use('/notices', noticesRouter);
app.use('/statistic', statisticRouter);
app.use('/upload', fileRouter);
app.use('/records', recordsRouter);
app.use('/mail', mailRouter);
app.use('/chart', chartRouter);
// 错误处理
app.use(handleError);

app.listen(app.get('port'), async (err: Error) => {
    if (err) {
        console.error(`[listen error]:${err.message}`);
        return;
    }
    console.log('[mysql]...连接数据库');
    await createConnection();
    console.log('[mysql]连接成功');
    console.log(`[started] app listen on ${app.get('port')}`);
});
