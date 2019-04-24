import { Req, Res, Global } from '../types';
import passport from './passport.service';
import { getRepository, getManager, Like } from 'typeorm';
import { User } from '../entities/User';
import { SEX } from '../types/enum';

export function login(req: Req, res: Res, next: any) {
    passport.authenticate('local.login', (error, user, info) => {
        if (error) return next({ ...error, code: 500 });
        if (user) {
            req.login(user, async err => {
                if (err) {
                    return next({ ...err, code: 500 });
                }
                const { job } = user;
                const g: Global = global;
                const acl = g.acl;
                let roles = job ? job.role : 'user';
                await acl.addUserRoles(user.id, roles);
                roles = await acl.userRoles(user.id);
                return res.apiSuccess({ ...user, roles });
            });
        } else {
            // 登录失败
            return next({ ...info, code: 401 });
        }
    })(req, res, next);
}
/**
 * 注册逻辑
 * 凭工号注册，由管理员分配部门和权限。登录的时候没有部门则不允许登录
 * @param req
 * @param res
 */
export async function register(req: Req, res: Res) {
    const { job_number, password } = req.body;
    const userRepository = getRepository(User);
    const hasRegisted = await userRepository.findOne({ job_number });
    if (hasRegisted) throw { message: '此工号已经注册', code: 401 };
    const manager = getManager();
    const user = manager.create(User, {
        job_number,
        password,
        name: `工号${job_number}`,
    });
    await manager.save(user);
    delete user.password;
    return res.apiSuccess(user);
}

export async function searchUser(req: Req, res: Res) {
    const { searchWord } = req.query;
    const userRepository = getRepository(User);
    const users = await userRepository.find({
        select: ['id', 'name', 'job_number'],
        take: 5,
        where: {
            name: Like(`%${searchWord}%`),
        },
    });
    return users;
}
// ================登录之后才能操作====================
export async function getUserInfo(job_number: string) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
        relations: ['job', 'bank'],
        where: { job_number },
    });
    delete user.password;
    const g: Global = global;
    const acl = g.acl;
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
        sex,
        education_degree,
        certificate_card,
        email,
        address,
        phone_number,
        birthday,
    }: {
        name: string;
        sex: SEX;
        education_degree: string;
        certificate_card: string;
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
            sex,
            education_degree,
            certificate_card,
            email,
            address,
            phone_number,
            birthday,
        },
    );
    return updatedUser;
}

export async function updateUserPassword(
    job_number: string,
    {
        new_password,
        old_password,
    }: {
        new_password: string;
        old_password: string;
    },
) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ job_number });
    if (user.password !== old_password) throw { message: '旧密码不正确!', code: 400 };
    const updatedUser = await userRepository.update(
        {
            job_number,
        },
        {
            password: new_password,
        },
    );
    return updatedUser;
}

export async function searchVerifyers(name: string) {
    const users = await getRepository(User)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.job', 'job')
        .where('job.role = :role', { role: 'verifyer' })
        .orWhere('job.role = :leaderRole', { leaderRole: 'leader' })
        .andWhere('name like :likeName', { likeName: `%${name}%` })
        .take(5)
        .getMany();
    return users;
}

export async function searchManagers(name: string) {
    const managers = await getRepository(User)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.job', 'job')
        .where('job.role = :role', { role: 'manager' })
        .andWhere('name like :likeName', { likeName: `%${name}%` })
        .take(5)
        .getMany();
    return managers;
}
