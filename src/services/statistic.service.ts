import { getRepository, getManager } from 'typeorm';
import { SaleActivity } from '../entities/SaleActivity';
import { ActivityStatistic } from '../entities/ActivityStatistic';
import { ActivityWithCustomer } from '../entities/ActivityWithCustomer';
import { Customer } from '../entities/Customer';
import { DepartmentCustomer } from '../entities/DepartmentCustomer';

// 设置营销目标
export async function setTarget(
    avtivityId: number,
    {
        target_money,
        target_customers_count,
    }: { target_money: number; target_customers_count: number },
) {
    return getManager().transaction(async manager => {
        const activity = await manager.findOne(SaleActivity, avtivityId);
        const statistic = manager.create(ActivityStatistic, {
            target_customers_count,
            target_money,
            activity,
        });
        return manager.save(statistic);
    });
}

// 联系客户
export async function contactCustomer(customerId: number, activityId: number) {
    return getManager().transaction(async manager => {
        const relation = await manager.findOne(ActivityWithCustomer, {
            customerId,
            activityId,
        });
        if (relation.contacted_count === 0) {
            // 第一次联系，除了+1外，statistic也要更新
            const { statistic } = await manager.findOne(SaleActivity, {
                relations: ['statistic'],
                where: {
                    id: activityId,
                },
            });
            statistic.contacted_count++;
            await manager.save(statistic);
        }
        relation.contacted_count++;
        return manager.save(relation);
    });
}
//确定参加活动
// 需要确定投入的资金
export async function customerJoinActivity(customerId: number, activityId: number, money: number) {
    return getManager().transaction(async manager => {
        const relation = await manager.findOne(ActivityWithCustomer, {
            customerId,
            activityId,
        });
        relation.joined = true;
        relation.invest_money = money;
        const { statistic } = await manager.findOne(SaleActivity, {
            relations: ['statistic'],
            where: {
                id: activityId,
            },
        });
        statistic.joined_count++;
        statistic.money_total += money;
        await manager.save(statistic);
        return manager.save(relation);
    });
}

export async function getActivityStatistic(activityId: number) {
    const activity = await getRepository(SaleActivity).findOne({
        relations: ['statistic'],
        where: { id: activityId },
    });
    return activity.statistic;
}
// 获取活动中的客户详情
export async function getActivityCustomers(activityId: number) {
    const relations = await getRepository(ActivityWithCustomer).find({
        activityId,
    });
    const {
        group: { customers },
    } = await getRepository(SaleActivity).findOne({
        relations: ['group', 'group.customers'],
        where: {
            id: activityId,
        },
    });
    const type = customers.length > 0 ? 'customer' : 'department';
    let result = [];
    if (type === 'customer') {
        result = await Promise.all(
            relations.map(async relation => {
                const { customerId } = relation;
                const customer = await getRepository(Customer).findOne(customerId);
                return {
                    ...relation,
                    customer,
                };
            }),
        );
    } else {
        result = await Promise.all(
            relations.map(async relation => {
                const { customerId } = relation;
                const customer = await getRepository(DepartmentCustomer).findOne(customerId);
                return {
                    ...relation,
                    customer,
                };
            }),
        );
    }
    return result;
}
