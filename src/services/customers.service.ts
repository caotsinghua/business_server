import { getRepository, getManager } from 'typeorm';
import { Customer } from '../entities/Customer';
import { SEX } from '../types/enum';
import { User } from '../entities/User';
import { DepartmentCustomer } from '../entities/DepartmentCustomer';
import { mockCustomerAccount, mockDepartmentAccount } from '../mock/account';
import { Account } from '../entities/Account';
import { mockCustomer, mockDepartment } from '../mock/customer';
export async function getCustomers({ page, pageSize }: { page: number; pageSize: number }) {
    const customersRepo = getRepository(Customer);
    const total = await customersRepo.createQueryBuilder().getCount();
    const customers = await customersRepo.find({
        skip: (page - 1) * pageSize,
        take: pageSize,
        relations: ['manager'],
    });
    return {
        total,
        page,
        pageSize,
        data: customers,
    };
}
export async function getCustomer(customerId: number) {
    const customer = await getRepository(Customer).findOne({
        relations: ['manager', 'account'],
        where: {
            id: customerId,
        },
    });
    return customer;
}
// 获取机构用户信息
export async function getDepartmentCustomers({
    page,
    pageSize,
}: {
    page: number;
    pageSize: number;
}) {
    const departmentCustomerRepo = getRepository(DepartmentCustomer);
    const total = await departmentCustomerRepo.createQueryBuilder().getCount();
    const data = await departmentCustomerRepo.find({
        relations: ['manager'],
        skip: (page - 1) * pageSize,
        take: pageSize,
    });
    return {
        total,
        page,
        pageSize,
        data,
    };
}

export async function getDepartmentCustomer(departmentCustomerId: number) {
    const departmentCustomer = await getRepository(DepartmentCustomer).findOne({
        relations: ['manager', 'account'],
        where: {
            id: departmentCustomerId,
        },
    });
    return departmentCustomer;
}
// 如果是manager角色，则客户的manager绑定到自己
// 如果其他角色,不绑定manager
export async function createDepartmentCustomer(
    job_number: number,
    {
        name,
        type,
        contact_person,
        phone_number,
        owner,
        description,
    }: {
        name: string;
        type: string;
        contact_person: string;
        phone_number: string;
        owner: string;
        description: string;
    },
): Promise<DepartmentCustomer> {
    let departmentCustomer = null;
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({
        relations: ['job'],
        where: {
            job_number,
        },
    });
    await getManager().transaction(async manager => {
        const account = manager.create(Account, mockDepartmentAccount());
        await manager.save(account);
        departmentCustomer = manager.create(DepartmentCustomer, {
            name,
            type,
            contact_person,
            phone_number,
            owner,
            description,
            account,
        });
        if (user.job && user.job.role === 'manager') {
            departmentCustomer.manager = user;
        }
        await manager.save(departmentCustomer);
    });
    return departmentCustomer;
}

// 如果是manager角色，则客户的manager绑定到自己
// 如果其他角色,不绑定manager
export async function createCustomer(
    job_number: number,
    {
        work,
        job,
        title,
        certificate_type,
        certificate_number,
        name,
        sex,
        education_degree,
        marry_status,
        household,
        work_time,
        birthday,
        description,
        email,
        address,
        phone_number,
    }: {
        work: string;
        job: string;
        title: string;
        certificate_type: string;
        certificate_number: string;
        name: string;
        sex: SEX;
        education_degree: string;
        marry_status: string;
        household: string;
        work_time: number;
        birthday: Date;
        description: string;
        email: string;
        address: string;
        phone_number: string;
    },
): Promise<Customer> {
    let customer = null;
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({
        relations: ['job'],
        where: {
            job_number,
        },
    });
    await getManager().transaction(async manager => {
        const account = manager.create(Account, mockCustomerAccount());
        await manager.save(account);
        customer = manager.create(Customer, {
            work,
            job,
            title,
            certificate_type,
            certificate_number,
            name,
            sex,
            education_degree,
            marry_status,
            household,
            work_time,
            birthday,
            description,
            email,
            address,
            phone_number,
            account,
        });
        if (user && user.job && user.job.role === 'manager') {
            customer.manager = user;
        }
        await manager.save(customer);
    });
    return customer;
}

export async function updateCustomer(
    job_number: number,
    customerId: number,
    {
        work,
        job,
        title,
        certificate_type,
        certificate_number,
        name,
        sex,
        education_degree,
        marry_status,
        household,
        work_time,
        birthday,
        description,
        email,
        address,
        phone_number,
    }: {
        work: string;
        job: string;
        title: string;
        certificate_type: string;
        certificate_number: string;
        name: string;
        sex: SEX;
        education_degree: string;
        marry_status: string;
        household: string;
        work_time: number;
        birthday: Date;
        description: string;
        email: string;
        address: string;
        phone_number: string;
    },
) {
    const user = await getRepository(User).findOne({
        relations: ['job'],
        where: {
            job_number,
        },
    });

    if (!user.job || (user.job.role !== 'manager' && user.id !== 1))
        throw { message: '该用户不是客户经理', code: 400 };
    const customer = await getRepository(Customer).findOne({
        relations: ['manager'],
        where: {
            id: customerId,
        },
    });
    Object.assign(customer, {
        work,
        job,
        title,
        certificate_type,
        certificate_number,
        name,
        sex,
        education_degree,
        marry_status,
        household,
        work_time,
        birthday,
        description,
        email,
        address,
        phone_number,
        manager: user,
    });
    return await getRepository(Customer).save(customer);
}
// 修改机构客户
export async function updateDepartmentCustomer(
    job_number: number,
    departmentCustomerId: number,
    {
        name,
        type,
        contact_person,
        phone_number,
        owner,
        description,
    }: {
        name: string;
        type: string;
        contact_person: string;
        phone_number: string;
        owner: string;
        description: string;
    },
) {
    const user = await getRepository(User).findOne({
        relations: ['job'],
        where: {
            job_number,
        },
    });
    if (!user.job || (user.job.role !== 'manager' && user.id !== 1))
        throw { message: '该用户不是客户经理', code: 400 };
    const departmentCustomer = await getRepository(DepartmentCustomer).findOne({
        relations: ['manager'],
        where: {
            id: departmentCustomerId,
        },
    });
    Object.assign(departmentCustomer, {
        name,
        type,
        contact_person,
        phone_number,
        owner,
        description,
        manager: user,
    });
    return await getRepository(DepartmentCustomer).save(departmentCustomer);
}

export async function mockCustomers(number: number) {
    await getManager().transaction(async manager => {
        for (let i = 0; i < number; i++) {
            let customerAccount = manager.create(Account, mockCustomerAccount());
            customerAccount = await manager.save(customerAccount);
            let departmentAccount = manager.create(Account, mockDepartmentAccount());
            departmentAccount = await manager.save(departmentAccount);
            let customer = manager.create(Customer, {
                ...mockCustomer(),
                account: customerAccount,
            });
            let department = manager.create(DepartmentCustomer, {
                ...mockDepartment(),
                account: departmentAccount,
            });
            console.log(customer);
            await manager.save(customer);
            await manager.save(department);
        }
    });
}
