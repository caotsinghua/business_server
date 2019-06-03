import { getRepository, getManager, Like } from 'typeorm';
import { SaleActivity } from '../entities/SaleActivity';
import { User } from '../entities/User';
import { Group } from '../entities/Group';
import { Verify } from '../entities/Verify';
import { VERIFY_STATUS, ACTIVITY_STATUS } from '../types/enum';
import { ActivityWithCustomer } from '../entities/ActivityWithCustomer';
import { ContactRecord } from '../entities/ContactRecord';
import sendMail from './mail.service';
export async function createActivity(
    job_number: number,
    {
        start_time,
        end_time,
        groupId,
        description,
        other_data,
        name,
        file,
    }: {
        start_time: Date;
        end_time: Date;
        groupId: number;
        description: string;
        other_data: string;
        name: string;
        file: string;
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
        const group = await manager.findOne(Group, {
            relations: ['customers', 'department_customers'],
            where: {
                id: groupId,
            },
        });
        // 获得客户群，创建每个客户和活动的关联
        const { customers, department_customers } = group;
        const people: any[] = customers.length > 0 ? customers : department_customers;
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
            name,
            file,
        });
        activity = await manager.save(activity);
        // 保存联系
        await Promise.all(
            people.map(person => {
                const relation = manager.create(ActivityWithCustomer, {
                    customerId: person.id,
                    activityId: activity.id,
                });
                return manager.save(relation);
            }),
        );
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
        file,
    }: {
        name: string;
        start_time: Date;
        end_time: Date;
        description: string;
        other_data: string;
        file: string;
    },
) {
    return getRepository(SaleActivity).update(activityId, {
        name,
        start_time,
        end_time,
        description,
        other_data,
        file,
    });
}
// 获取客户（自然人）参加的活动信息
export async function getCustomerRelationActivities(customerId: number) {
    let relations = await getRepository(ActivityWithCustomer).find({
        where: {
            customerId,
            joined: true,
        },
    });
    relations = await Promise.all(
        relations.map(async relation => {
            const { activityId } = relation;
            const activity = await getRepository(SaleActivity).findOne(activityId);
            return {
                ...relation,
                activity,
            };
        }),
    );
    return relations;
}
// 获取活动中的客户推荐记录
export async function getCustomerActivityRecords(customerId: number, activityId: number) {
    let { records } = await getRepository(ActivityWithCustomer).findOne({
        relations: ['records'],
        where: { customerId, activityId },
    });
    return records;
}
// 根据type执行对应的服务，邮箱，短信，
// TODO 短信、邮件
// 废弃-》使用单独的邮件api
export async function createContactRecord(customerId: number, activityId: number, type: string) {
    const relation = await getRepository(ActivityWithCustomer).findOne({ customerId, activityId });
    let record = getManager().create(ContactRecord, {
        type,
        relation,
    });
    return getManager().save(record);
}

export async function createMailRecord(
    customerId: number,
    activityId: number,
    {
        subject,
        text,
        html,
        to,
    }: {
        subject: string;
        text: string;
        html: string;
        to: string;
    },
) {
    const relation = await getRepository(ActivityWithCustomer).findOne({ customerId, activityId });
    const from = '"盐城医院" 1577499543@qq.com';
    let record = getManager().create(ContactRecord, {
        type: 'email',
        relation,
        subject,
        text,
        html,
        to,
    });
    const result = await sendMail({ from, to, subject, text, html });
    console.log({ result });
    return getManager().save(record);
}
// 成功还是失败
export async function updateRecordStatus(recordId: number, success: boolean) {
    return getManager().update(ContactRecord, recordId, {
        success,
    });
}

//评出优先级
export async function createActivityCutomerPriority(
    customerId: number,
    activityId: number,
    priority: number,
) {
    return getManager().update(
        ActivityWithCustomer,
        { customerId, activityId },
        {
            priority,
        },
    );
}
