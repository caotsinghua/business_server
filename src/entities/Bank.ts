import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm';
import { User } from './User';
import { Job } from './Job';
import { GroupModel } from './GroupModel';
import { SaleActivity } from './SaleActivity';
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
    description: string; //描述
    @OneToOne(type => User)
    @JoinColumn()
    leader: User; //负责人
    @CreateDateColumn()
    created_time: Date; //成立时间
    @OneToMany(type => User, user => user.bank)
    staffs: User[]; //所属员工
    @OneToMany(type => Job, job => job.bank)
    jobs: Job[];
    @OneToMany(type => GroupModel, gm => gm.bank)
    group_models: GroupModel[];
    @OneToMany(type => Bank, bank => bank.parent_bank)
    sub_banks: Bank[];
    @ManyToOne(type => Bank, bank => bank.sub_banks)
    parent_bank: Bank;
    @OneToMany(type => SaleActivity, activity => activity.bank)
    sale_activities: SaleActivity[];
}
