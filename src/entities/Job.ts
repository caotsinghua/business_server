import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { User } from './User';
import { Bank } from './Bank';
@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number; // 岗位编号
    @OneToMany(type => User, user => user.job)
    users: User[];
    @Column()
    title: string; // 职称
    @Column()
    post: string; // 职务- role
    @ManyToOne(type => Bank, bank => bank.jobs)
    department: Bank; // 所属机构
}
