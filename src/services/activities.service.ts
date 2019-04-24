import { getRepository, getManager, Like } from 'typeorm';
import { SaleActivity } from '../entities/SaleActivity';
import { User } from '../entities/User';
import { Group } from '../entities/Group';
import { Verify } from '../entities/Verify';
import { VERIFY_STATUS, ACTIVITY_STATUS } from '../types/enum';
export async function createActivity(
    job_number: number,
    {
        start_time,
        end_time,
        groupId,
        description,
        other_data,
        target,
        name,
    }: {
        start_time: Date;
        end_time: Date;
        groupId: number;
        description: string;
        other_data: string;
        target: string;
        name: string;
    },
) {
    let activity: SaleActivity = null;
    await getManager().transaction(async manager => {
        const creater = await manager.findOne(User, {
            relations: ['bank'],
            where: {
                job_number,
            },
        });
        const { bank } = creater;
        const group = await manager.findOne(Group, groupId);
        let verify_data = manager.create(Verify, {});
        verify_data = await manager.save(verify_data);
        activity = manager.create(SaleActivity, {
            start_time,
            end_time,
            description,
            other_data,
            creater,
            verify_data,
            group,
            bank,
            target,
            name,
        });
        activity = await manager.save(activity);
    });
    return activity;
}

// 绑定到客户经理
export async function bindManager(managerId: number, activityId: number) {
    const manager = await getRepository(User).findOne(managerId);
    return getRepository(SaleActivity).update(activityId, {
        manager,
    });
}

// 提交审批
export async function bindVerifyer(verifyerId: number, activityId: number) {
    const verifyer = await getRepository(User).findOne(verifyerId);
    const activity = await getRepository(SaleActivity).findOne({
        relations: ['verify_data'],
        where: {
            id: activityId,
        },
    });
    const { verify_data } = activity;
    return getRepository(Verify).update(verify_data.id, {
        verifyer,
        verify_status: VERIFY_STATUS.VERIFYING,
    });
}

// 修改审批状态
export async function patchVerifyStatus(
    activityId: number,
    status: VERIFY_STATUS,
    nopass_reason: string,
) {
    const { verify_data } = await getRepository(SaleActivity).findOne({
        relations: ['verify_data'],
        where: {
            id: activityId,
        },
    });
    return getRepository(Verify).update(verify_data.id, {
        verify_status: status,
        nopass_reason,
    });
}

export async function patchActivityStatus(activityId: number, status: ACTIVITY_STATUS) {
    return getRepository(SaleActivity).update(activityId, {
        status,
    });
}

export async function getActivities(page: number, pageSize: number) {
    const list = await getRepository(SaleActivity).find({
        relations: ['creater', 'manager', 'verify_data', 'bank', 'verify_data.verifyer'],
        skip: (page - 1) * pageSize,
        take: pageSize,
    });
    const total = await getRepository(SaleActivity)
        .createQueryBuilder()
        .getCount();
    return { total, list, page, pageSize };
}

export async function getActivity(activityId: number) {
    return getRepository(SaleActivity).findOne({
        relations: ['creater', 'manager', 'verify_data', 'group', 'bank', 'verify_data.verifyer'],
        where: {
            id: activityId,
        },
    });
}

export async function updateActivity(
    activityId: number,
    {
        name,
        start_time,
        end_time,
        description,
        other_data,
        target,
    }: {
        name: string;
        start_time: Date;
        end_time: Date;
        description: string;
        other_data: string;
        target: string;
    },
) {
    return getRepository(SaleActivity).update(activityId, {
        name,
        start_time,
        end_time,
        description,
        other_data,
        target,
    });
}
