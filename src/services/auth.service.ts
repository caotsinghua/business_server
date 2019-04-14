import { Req, Res, Global } from '../types';
import passport from './passport.service';
import { getRepository, getManager } from 'typeorm';
import { User } from '../entities/User';
import { SEX } from '../types/enum';
const g: Global = global;
const acl = g.acl;

export function login(req: Req, res: Res, next: any) {
    passport.authenticate('local.login', (error, user, info) => {
        if (error) return next({ ...error, code: 500 });
        if (user) {
            req.login(user, async err => {
                if (err) {
                    return next({ ...err, code: 500 });
                }
                console.log(user);
                const { bank } = user;
                return res.apiSuccess(user);
            });
        } else {
            // 登录失败
            return next({ ...info, code: 401 });
        }
    })(req, res, next);
}

export async function register(req: Req, res: Res) {
    const { job_number, password, bankId, jobId } = req.body;
    const userRepository = getRepository(User);
    const hasRegisted = await userRepository.findOne({ job_number });
    if (hasRegisted) throw { message: '此工号已经注册', code: 401 };
    const manager = getManager();
    const user = manager.create(User, {
        job_number,
        password,
        bank: bankId,
        job: jobId,
    });
    await manager.save(user);
    delete user.password;
    return res.apiSuccess(user);
}
// ================登录之后才能操作====================
export async function getUserInfo(job_number: string) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ job_number });
    delete user.password;
    const roles = await acl.userRoles(user.id);
    return {
        ...user,
        roles,
    };
}

export async function updateUserInfo(
    job_number: string,
    {
        name,
        password,
        sex,
        education_degree,
        certificate_card,
        join_date,
        email,
        address,
        phone_number,
        birthday,
    }: {
        name: string;
        password: string;
        sex: SEX;
        education_degree: string;
        certificate_card: string;
        join_date: Date;
        email: string;
        address: string;
        phone_number: string;
        birthday: Date;
    },
) {
    const userRepository = getRepository(User);
    const updatedUser = await userRepository.update(
        {
            job_number,
        },
        {
            name,
            password,
            sex,
            education_degree,
            certificate_card,
            join_date,
            email,
            address,
            phone_number,
            birthday,
        },
    );
    return updatedUser;
}
