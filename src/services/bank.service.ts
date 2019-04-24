import { getRepository, getManager, Like, IsNull, Not } from 'typeorm';
import { Bank } from '../entities/Bank';
import { User } from '../entities/User';
import jobsConfig from '../config/jobs.config';
import { Job } from '../entities/Job';
export async function getBanks() {
    const bankRepository = getRepository(Bank);
    const banks = await bankRepository.find({
        relations: ['parent_bank', 'leader'],
    });
    return banks;
}
export async function getUserBanks(job_number: number) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
        relations: ['bank'],
        where: {
            job_number,
        },
    });
    const { bank } = user;
    return bank;
}
export async function getBank(bankId: number) {
    const bankRepository = getRepository(Bank);
    const bank = await bankRepository.findOne({
        relations: ['parent_bank', 'leader', 'sub_banks', 'jobs'],
        where: { id: bankId },
    });
    return bank;
}
// 创建银行
export async function createBank({
    name,
    address,
    phone_number,
    description,
}: {
    name: string;
    address: string;
    phone_number: string;
    description: string;
}) {
    const bank = await getManager().transaction(async manager => {
        const jobs = jobsConfig.map(({ title, post, role }) => {
            return manager.create(Job, {
                title,
                post,
                role,
            });
        });
        await manager.save(jobs);
        let newBank = manager.create(Bank, {
            name,
            address,
            phone_number,
            description,
            jobs,
        });
        return manager.save(newBank);
    });

    return bank;
}
// 创建用户支行
export async function createSubBank(
    job_number: string,
    {
        name,
        address,
        phone_number,
        description,
    }: {
        name: string;
        address: string;
        phone_number: string;
        description: string;
    },
) {
    const userRepository = getRepository(User);
    const bankRepository = getRepository(Bank);
    const user = await userRepository.findOne({
        relations: ['bank'],
        where: { job_number },
    });
    const { bank } = user;
    if (!bank) throw { message: '当前用户没有银行！', code: 400 };
    const subBank = bankRepository.create({
        name,
        address,
        phone_number,
        description,
        parent_bank: bank,
    });
    const resultBank = await bankRepository.save(subBank);
    return resultBank;
}
export async function updateBank(
    bankId: number,
    {
        name,
        address,
        phone_number,
        description,
        leaderId,
        parentBankId,
    }: {
        name: string;
        address: string;
        phone_number: string;
        description: string;
        leaderId: number;
        parentBankId: number;
    },
) {
    const bankRepository = getRepository(Bank);
    const userRepository = getRepository(User);

    const bank = await bankRepository.findOne({
        relations: ['leader', 'jobs'],
        where: {
            id: bankId,
        },
    });
    await getManager().transaction(async manager => {
        let leader = null;
        let parentBank = null;
        if (leaderId) {
            leader = await userRepository.findOne({
                relations: ['bank', 'job'],
                where: {
                    id: leaderId,
                },
            });
            leader.bank = bank;
            leader.job = bank.jobs[0];
            leader = await manager.save(leader);
        } else {
            // 删除银行的负责人
            // 删除该用户的职位
            leader = bank.leader;
            if (leader) {
                leader.bank = null;
                leader.job = null;
                leader = await manager.save(leader);
            }
        }
        if (parentBankId) parentBank = await bankRepository.findOne(parentBankId);

        Object.assign(bank, {
            name,
            address,
            phone_number,
            description,
            leader,
            parent_bank: parentBank,
        });
        if (leader && !leader.bank) {
            bank.leader = null;
        }
        return manager.save(bank);
    });
}

export async function deleteBank(bankId: number) {
    const bankRepository = getRepository(Bank);
    const bank = await bankRepository.delete(bankId);
    return bank;
}

export async function searchBank(searchWord: string) {
    const bankRepository = getRepository(Bank);
    const banks = await bankRepository.find({
        select: ['id', 'name'],
        relations: ['parent_bank'],
        take: 5,
        where: {
            name: Like(`%${searchWord}%`),
            parent_bank: IsNull(),
        },
    });
    return banks;
}
// 获取银行的指定岗位的用户
export async function getBankStaffsWithJob(bankId: number, jobId: number) {
    const bankRepository = getRepository(Bank);
    const userRepository = getRepository(User);
    const bank = await bankRepository.findOne({
        relations: ['staffs'],
        where: {
            id: bankId,
        },
    });
    if (!bank) throw { message: '没有此银行', code: 404 };
    const { staffs } = bank;
    const staffsWithJob = await Promise.all(
        staffs.map(staff =>
            userRepository.findOne({
                relations: ['job'],
                where: {
                    id: staff.id,
                },
            }),
        ),
    );
    return staffsWithJob.filter(staff => staff.job && staff.job.id === +jobId);
}
// 添加用户到指定岗位
export async function addStaffToBankWithJob({ userId, jobId }: { userId: number; jobId: number }) {
    const manager = getManager();
    const job = await manager.findOne(Job, {
        relations: ['bank'],
        where: {
            id: jobId,
        },
    });
    if (!job) throw { message: '该岗位不存在', code: 404 };
    const { bank } = job;
    await manager.update(User, userId, {
        bank,
        job,
    });
}

// 删除指定用户的岗位
export async function deleteStaffFromBankWithJob(userId: number) {
    return getManager().transaction(async manager => {
        await manager.update(User, userId, {
            job: null,
        });
    });
}
