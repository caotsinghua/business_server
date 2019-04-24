import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    OneToOne,
} from 'typeorm';
import { Bank } from './Bank';
import { Job } from './Job';
import { SEX } from '../types/enum';
import { Customer } from './Customer';
import { DepartmentCustomer } from './DepartmentCustomer';
import { SaleActivity } from './SaleActivity';
import { Verify } from './Verify';
import { Group } from './Group';
import { Notice } from './Notice';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number; //员工id
    @Column()
    name: string; //姓名
    @Column()
    password: string; //密码 - to login
    @Column({
        unique: true,
    })
    job_number: string; //工号 -to login
    @Column({
        type: 'enum',
        enum: SEX,
        default: SEX.MALE,
    })
    sex: SEX; // 性别
    @Column({
        nullable: true,
    })
    education_degree: string; //文化程度 -小学，初中...
    @Column({
        nullable: true,
    })
    certificate_card: string; //身份证号
    @CreateDateColumn()
    join_date: Date; //入行时间
    @Column({
        nullable: true,
    })
    email: string; //邮箱
    @Column({
        nullable: true,
    })
    address: string; //家庭地址
    @Column({
        nullable: true,
    })
    phone_number: string; //联系电话
    @Column({
        nullable: true,
    })
    birthday: Date; //出生日期
    @Column({
        nullable: true,
    })
    status: string; //用户状态 -todo
    @ManyToOne(type => Bank, bank => bank.staffs)
    bank: Bank; // 所属机构
    @ManyToOne(type => Job, job => job.users)
    job: Job; // 岗位
    @OneToMany(type => Customer, customer => customer.manager)
    customers: Customer[];
    @OneToMany(type => DepartmentCustomer, dc => dc.manager)
    department_customers: DepartmentCustomer[];
    @OneToMany(type => SaleActivity, activity => activity.creater)
    sale_activities: SaleActivity[];
    @OneToMany(type => SaleActivity, activity => activity.manager)
    manager_activities: SaleActivity[];
    @OneToMany(type => Verify, verify => verify.verifyer)
    verify_items: Verify[]; //审核的信息
    @OneToMany(type => Notice, notice => notice.from)
    sended_notices: Notice[];
    @OneToMany(type => Notice, notice => notice.to)
    received_notices: Notice[];
}
