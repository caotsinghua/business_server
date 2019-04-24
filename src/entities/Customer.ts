import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    ManyToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { SEX } from '../types/enum';
import { User } from './User';
import { Group } from './Group';
import { Account } from './Account';
@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        nullable: true,
    })
    work: string; //职业
    @Column({
        nullable: true,
    })
    job: string; //职务
    @Column()
    certificate_type: string; //证件类型
    @Column()
    certificate_number: string; //证件号码
    @Column({
        nullable: true,
    })
    title: string; //职称
    @Column()
    name: string; //客户姓名
    @Column({
        type: 'enum',
        enum: SEX,
        default: SEX.MALE,
    })
    sex: SEX; // 性别
    @Column({
        nullable: true,
    })
    education_degree: string; //文化程度
    @ManyToMany(type => Group, group => group.customers)
    groups: Group[]; //客户群编号----todo
    @Column({
        nullable: true,
    })
    type: string; //客户类别
    @Column({
        nullable: true,
    })
    marry_status: string; //婚姻状况
    @Column({
        nullable: true,
    })
    household: string; //户籍
    @Column({
        nullable: true,
    })
    work_time: number; //工作年限
    @Column()
    birthday: Date; //出生日期
    @CreateDateColumn()
    create_at: Date; //创建时间
    @Column({
        nullable: true,
    })
    description: string; //备注
    @ManyToOne(type => User, manager => manager.customers)
    manager: User; //客户经理 -当客户经理角色创建的时候绑定
    @Column({
        nullable: true,
    })
    email: String; //邮箱
    @Column()
    address: string; //家庭住址
    @Column()
    phone_number: string; //手机号码
    @OneToOne(type => Account)
    @JoinColumn()
    account: Account;
}
