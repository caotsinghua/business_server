import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    ManyToMany,
} from 'typeorm';
import { SEX } from '../types/enum';
import { User } from './User';
import { Group } from './Group';
@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    work: string; //职业
    @Column()
    job: string; //职务
    @Column()
    certificate_type: string; //证件类型
    @Column()
    certificate_number: string; //证件号码
    @Column()
    title: string; //职称
    @Column()
    name: string; //客户姓名
    @Column({
        type: 'enum',
        enum: SEX,
        default: SEX.MALE,
    })
    sex: SEX; // 性别
    @Column()
    education_degree: string; //文化程度
    @ManyToMany(type => Group, group => group.customers)
    groups: Group[]; //客户群编号----todo
    @Column()
    type: string; //客户类别
    @Column()
    marry_status: string; //婚姻状况
    @Column()
    household: string; //户籍
    @Column()
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
    manager: User; //客户经理
    @Column()
    email: String; //邮箱
    @Column()
    address: string; //家庭住址
    @Column()
    phone_number: string; //手机号码
}
