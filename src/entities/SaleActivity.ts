import {
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToOne,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './User';
import { ACTIVITY_STATUS } from '../types/enum';
import { Verify } from './Verify';
import { Group } from './Group';
import { Bank } from './Bank';
import { ActivityStatistic } from './ActivityStatistic';
@Entity()
export class SaleActivity {
    @PrimaryGeneratedColumn()
    id: number;
    @UpdateDateColumn()
    latest_update_time: Date; // 最后修改时间
    @CreateDateColumn()
    created_time: Date; //创建时间
    @ManyToOne(type => User, creater => creater.sale_activities)
    creater: User; //创建者
    @ManyToOne(type => User, manager => manager.manager_activities)
    manager: User; // 所属客户经理
    @OneToOne(type => Verify, verify => verify.sale_activity)
    verify_data: Verify;
    @Column({
        type: 'enum',
        enum: ACTIVITY_STATUS,
        default: ACTIVITY_STATUS.CREATED,
    })
    status: ACTIVITY_STATUS;
    @Column()
    start_time: Date; //开始时间
    @Column()
    end_time: Date; //结束时间
    @ManyToOne(type => Group, group => group.activities)
    group: Group; //目标客户群
    @ManyToOne(type => Bank, bank => bank.sale_activities)
    bank: Bank; // 所属的银行
    @Column()
    description: string; //活动描述
    @Column({
        nullable: true,
    })
    other_data: string; //备注
    @Column({
        nullable: true,
    })
    target: string; //营销目标
    @Column()
    name: string; //活动名称
    @OneToOne(type => ActivityStatistic, statistic => statistic.activity)
    statistic: ActivityStatistic; //活动数据
    @Column({
        nullable: true,
    })
    file: string; //附件地址
}
