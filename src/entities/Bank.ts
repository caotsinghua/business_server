import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Job } from './Job';
import { GroupModel } from './GroupModel';
@Entity()
export class Bank {
    @PrimaryGeneratedColumn()
    id: number; //机构编号
    @Column({
        unique: true,
    })
    name: string; //银行名称
    @Column()
    address: string; //银行地址
    @Column()
    phone_number: string; //联系方式
    @Column({
        nullable: true,
    })
    abbr: string; //简称
    @OneToOne(type => User, { eager: true })
    @JoinColumn()
    leader: User; //负责人
    @Column({
        nullable: true,
    })
    created_time: Date; //成立时间
    @OneToMany(type => User, user => user.bank, {
        eager: true,
    })
    staffs: User[]; //所属员工
    @OneToMany(type => Job, job => job.department, {
        eager: true,
    })
    jobs: Job[];
    @OneToMany(type => GroupModel, gm => gm.department, {
        eager: true,
    })
    group_models: GroupModel[];
    @Column({
        default: false,
    })
    isroot: boolean; //true是总行/分行，其他都是该银行的下属支行
}
