import { getRepository, getManager, MoreThanOrEqual, MoreThan } from 'typeorm';
import { GroupModel } from '../entities/GroupModel';
import { Customer } from '../entities/Customer';
import { DepartmentCustomer } from '../entities/DepartmentCustomer';
import { User } from '../entities/User';
import { Group } from '../entities/Group';

export async function createModelAndGroup(
    job_number: number,
    {
        name,
        description,
        income_min = 0,
        income_max,
        points_min = 0,
        points_max,
        debt_min = 0,
        debt_max,
        deposit_min = 0,
        deposit_max,
        loan_min = 0,
        loan_max,
        danger_level,
        creadit_level,
        back_ability,
        is_department,
    }: {
        name: string;
        description: string;
        income_min: number;
        income_max: number;
        points_min: number;
        points_max: number;
        debt_min: number;
        debt_max: number;
        deposit_min: number;
        deposit_max: number;
        loan_min: number;
        loan_max: number;
        danger_level: string;
        creadit_level: string;
        back_ability: string;
        is_department: boolean;
    },
) {
    let model: GroupModel = null;
    let group: Group = null;
    let customers: any = [];
    await getManager().transaction(async manager => {
        const creater = await getRepository(User).findOne({
            relations: ['bank'],
            where: {
                job_number,
            },
        });
        const bank = creater.bank;

        let customerRepository: any = is_department
            ? getRepository(DepartmentCustomer)
            : getRepository(Customer);
        let query = '';
        query = danger_level ? `${query} and account.danger_level = :danger_level` : query;
        query = creadit_level ? `${query} and account.creadit_level = :creadit_level` : query;
        query = back_ability ? `${query} and account.back_ability = :back_ability` : query;
        if (query.length > 0) query = query.replace(/and/, '');
        console.log(query);
        const customerQuery = await customerRepository
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.account', 'account')
            .where('account.income > :income_min and account.income < :income_max', {
                income_min,
                income_max: income_max || 2147483647,
            })
            .andWhere('account.points > :points_min and account.points < :points_max', {
                points_min,
                points_max: points_max || 2147483647,
            })
            .andWhere('account.debt > :debt_min and account.debt < :debt_max', {
                debt_min,
                debt_max: debt_max || 2147483647,
            })
            .andWhere('account.deposit > :deposit_min and account.deposit < :deposit_max', {
                deposit_min,
                deposit_max: deposit_max || 2147483647,
            })
            .andWhere('account.loan > :loan_min and account.loan < :loan_max', {
                loan_min,
                loan_max: loan_max || 2147483647,
            });
        if (query) {
            customers = await customerQuery
                .andWhere(query, {
                    danger_level,
                    creadit_level,
                    back_ability,
                })
                .getMany();
        } else {
            customers = await customerQuery.getMany();
        }
        model = manager.create(GroupModel, {
            name,
            description,
            income_min,
            income_max,
            points_min,
            points_max,
            debt_min,
            debt_max,
            deposit_min,
            deposit_max,
            loan_min,
            loan_max,
            danger_level,
            creadit_level,
            back_ability,
            is_department,
            bank,
        });
        model = await manager.save(model);
        group = is_department
            ? manager.create(Group, {
                  name,
                  model,
                  department_customers: customers,
              })
            : manager.create(Group, {
                  name,
                  model,
                  customers,
              });

        group = await manager.save(group);
    });
    return { model, group, customers };
}

export async function findData() {
    let customers: any = [];
    let income_min = 0,
        income_max = 2147483647,
        points_min = 0,
        points_max = 2147483647,
        debt_min = 0,
        debt_max = 2147483647,
        deposit_min = 0,
        deposit_max = 2147483647,
        loan_min = 0,
        loan_max = 2147483647,
        danger_level = '',
        creadit_level = '',
        back_ability = '';
    await getManager().transaction(async manager => {
        let query = '';
        query = danger_level ? `${query} and account.danger_level = :danger_level` : query;
        query = creadit_level ? `${query} and account.creadit_level = :creadit_level` : query;
        query = back_ability ? `${query} and account.back_ability = :back_ability` : query;
        if (query.length > 0) query = query.replace(/and/, '');
        console.log(query);
        const customerQuery = getRepository(Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.account', 'account')
            .where('account.income > :income_min and account.income < :income_max', {
                income_min,
                income_max,
            })
            .andWhere('account.points > :points_min and account.points < :points_max', {
                points_min,
                points_max,
            })
            .andWhere('account.debt > :debt_min and account.debt < :debt_max', {
                debt_min,
                debt_max,
            })
            .andWhere('account.deposit > :deposit_min and account.deposit < :deposit_max', {
                deposit_min,
                deposit_max,
            })
            .andWhere('account.loan > :loan_min and account.loan < :loan_max', {
                loan_min,
                loan_max,
            });
        if (query) {
            customers = await customerQuery
                .andWhere(query, {
                    danger_level,
                    creadit_level,
                    back_ability,
                })
                .getMany();
        } else {
            customers = await customerQuery.getMany();
        }
    });
    return customers;
}

export async function getGroups() {
    return getRepository(Group).find({
        relations: ['customers', 'department_customers'],
    });
}
