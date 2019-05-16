import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { Req } from '../types';

passport.serializeUser((user: User, done) => {
    done(null, user.job_number);
});
passport.deserializeUser(async (job_number: string, done: any) => {
    try {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ job_number });
        if (user) {
            done(null, user);
        } else {
            done(null, false, { message: 'deserialize 错误' });
        }
    } catch (error) {
        done(error, false);
    }
});

passport.use(
    'local.login',
    new LocalStrategy(
        {
            usernameField: 'job_number',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req: Req, job_number: string, password: string, done: any) => {
            console.log({
                job_number,
                password,
            });
            try {
                const userRepository = getRepository(User);
                const user = await userRepository.findOne({
                    relations: ['bank', 'job'],
                    where: { job_number },
                });
                if (!user) {
                    return done(null, false, { message: '账户不存在' });
                }
                if (user.password !== password) {
                    return done(null, false, { message: '密码错误' });
                }
                if (user.id !== 1 && !user.job) {
                    return done(null, false, { message: '用户还没有岗位，请联系主管设置。' });
                }
                delete user.password;
                req.userInfo = user;
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        },
    ),
);

export default passport;
